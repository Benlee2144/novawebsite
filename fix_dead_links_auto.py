#!/usr/bin/env python3

import os
import re
import glob
import shutil
from collections import defaultdict

def get_max_verse_in_interlinear(file_path):
    """Get the maximum verse number in an interlinear file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find all verse numbers in the format <span class="verse-num">N</span>
        verse_matches = re.findall(r'<span class="verse-num">(\d+)</span>', content)
        if verse_matches:
            return max(int(v) for v in verse_matches)
        return 0
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return 0

def is_verse_valid(book, chapter, verse_text):
    """Check if a verse reference is valid by checking the interlinear file."""
    interlinear_file = f"interlinear/{book}-{chapter}.html"
    
    if not os.path.exists(interlinear_file):
        return False
    
    max_verse = get_max_verse_in_interlinear(interlinear_file)
    
    # Extract verse numbers from the verse text
    verse_numbers = re.findall(r'\b(\d+)\b', verse_text)
    for verse_str in verse_numbers:
        verse_num = int(verse_str)
        if verse_num > max_verse and verse_num <= 200:  # Reasonable verse number
            return False
    
    return True

def fix_lexicon_file(file_path):
    """Fix dead verse links in a lexicon file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = 0
        
        # Find all href links to interlinear pages
        pattern = r'<a href="../interlinear/([a-z0-9]+)-(\d+)\.html"[^>]*>([^<]+)</a>'
        
        def replace_link(match):
            nonlocal changes_made
            book, chapter, link_text = match.groups()
            
            # Check if this reference is valid
            if not is_verse_valid(book, int(chapter), link_text):
                changes_made += 1
                # Replace with plain text (remove the link)
                return link_text.strip()
            else:
                # Keep the original link
                return match.group(0)
        
        content = re.sub(pattern, replace_link, content)
        
        if changes_made > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
        
        return changes_made
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return 0

def create_backup():
    """Create a backup of the lexicon directory."""
    backup_dir = "lexicon_backup"
    
    if os.path.exists(backup_dir):
        print(f"Backup directory {backup_dir} already exists.")
        return False
    
    print("Creating backup of lexicon directory...")
    shutil.copytree("lexicon", backup_dir)
    print(f"Backup created at {backup_dir}")
    return True

def fix_all_lexicon_files():
    """Fix dead verse links in all lexicon files."""
    lexicon_files = glob.glob('lexicon/*.html')
    total_files = len(lexicon_files)
    total_changes = 0
    files_changed = 0
    
    print(f"Processing {total_files} lexicon files...")
    
    for i, file_path in enumerate(lexicon_files):
        if i % 500 == 0:
            print(f"Progress: {i}/{total_files}")
        
        changes = fix_lexicon_file(file_path)
        if changes > 0:
            total_changes += changes
            files_changed += 1
    
    print(f"\nSummary:")
    print(f"Files changed: {files_changed}")
    print(f"Total dead links fixed: {total_changes}")
    
    return files_changed, total_changes

if __name__ == "__main__":
    os.chdir('/tmp/novawebsite')
    
    print("Dead Verse Links Fixer (Auto Mode)")
    print("===================================")
    
    # Create backup first
    create_backup()
    
    # Fix the links
    print("\nFixing dead verse links...")
    files_changed, total_changes = fix_all_lexicon_files()
    
    if total_changes > 0:
        print(f"\nComplete! Fixed {total_changes} dead links in {files_changed} files.")
        print("Changes have been applied.")
    else:
        print("No dead links found.")