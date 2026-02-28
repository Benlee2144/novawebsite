#!/usr/bin/env python3

import os
import re
import glob
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

def parse_verse_references(link_text):
    """Parse verse references from link text like 'Isaiah 66:11' or 'Mat.13:28-30'."""
    verse_refs = []
    
    # Pattern for references like "Isaiah 66:11", "Mat.13:28-30", "Act.4:6 13:5"
    # First try colon-separated format: Book Chapter:Verse or Book Chapter:Verse-Verse
    colon_pattern = r'(\d+):(\d+)(?:-(\d+))?'
    colon_matches = re.findall(colon_pattern, link_text)
    
    for match in colon_matches:
        chapter, start_verse, end_verse = match
        start_v = int(start_verse)
        verse_refs.append(start_v)
        
        if end_verse:  # Range like 28-30
            end_v = int(end_verse)
            for v in range(start_v + 1, end_v + 1):
                verse_refs.append(v)
    
    # If no colon format found, look for standalone numbers that could be verses
    if not verse_refs:
        # Look for numbers that follow a pattern like "Act.1:13" where we might have just "13"
        number_pattern = r'\b(\d+)\b'
        numbers = re.findall(number_pattern, link_text)
        # Filter out chapter numbers (usually first number) and years (4-digit numbers)
        for num_str in numbers:
            num = int(num_str)
            if 1 <= num <= 200:  # Reasonable verse range
                verse_refs.append(num)
    
    return list(set(verse_refs))  # Remove duplicates

def extract_verse_refs_from_lexicon():
    """Extract all verse references from lexicon files."""
    verse_refs = []
    lexicon_files = glob.glob('lexicon/*.html')
    
    print(f"Analyzing {len(lexicon_files)} lexicon files...")
    
    for i, file_path in enumerate(lexicon_files):
        if i % 1000 == 0:
            print(f"Progress: {i}/{len(lexicon_files)}")
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all href links to interlinear pages
            # Pattern: href="../interlinear/book-chapter.html"
            pattern = r'href="../interlinear/([a-z0-9]+)-(\d+)\.html"[^>]*>([^<]+)</a>'
            matches = re.findall(pattern, content)
            
            for match in matches:
                book, chapter, link_text = match
                # Parse verse numbers from link text
                verse_nums = parse_verse_references(link_text)
                
                for verse_num in verse_nums:
                    if verse_num > 0:  # Valid verse number
                        verse_refs.append({
                            'lexicon_file': file_path,
                            'book': book,
                            'chapter': int(chapter),
                            'verse': verse_num,
                            'link_text': link_text.strip()
                        })
        except Exception as e:
            print(f"Error reading {file_path}: {e}")
    
    return verse_refs

def check_dead_links():
    """Check for dead verse links in lexicon files."""
    print("Extracting verse references from lexicon files...")
    verse_refs = extract_verse_refs_from_lexicon()
    
    print(f"Found {len(verse_refs)} verse references to check")
    
    # Group by book-chapter
    book_chapter_refs = defaultdict(list)
    for ref in verse_refs:
        key = f"{ref['book']}-{ref['chapter']}"
        book_chapter_refs[key].append(ref)
    
    dead_links = []
    total_checked = 0
    
    print("Checking verse references against interlinear files...")
    for i, (book_chapter, refs) in enumerate(book_chapter_refs.items()):
        if i % 100 == 0:
            print(f"Progress: {i}/{len(book_chapter_refs)}")
            
        interlinear_file = f"interlinear/{book_chapter}.html"
        
        if not os.path.exists(interlinear_file):
            # Entire book-chapter doesn't exist
            for ref in refs:
                dead_links.append({
                    'type': 'missing_file',
                    'reason': f"Interlinear file {interlinear_file} doesn't exist",
                    **ref
                })
            total_checked += len(refs)
            continue
        
        # File exists, check verse numbers
        max_verse = get_max_verse_in_interlinear(interlinear_file)
        
        for ref in refs:
            total_checked += 1
            if ref['verse'] > max_verse:
                dead_links.append({
                    'type': 'verse_out_of_range',
                    'reason': f"Verse {ref['verse']} > max verse {max_verse} in {interlinear_file}",
                    **ref
                })
    
    print(f"Analysis complete: {total_checked} references checked")
    print(f"Found {len(dead_links)} dead links")
    
    # Group dead links by type
    by_type = defaultdict(list)
    for link in dead_links:
        by_type[link['type']].append(link)
    
    print(f"\nBreakdown by type:")
    for link_type, links in by_type.items():
        print(f"  {link_type}: {len(links)} links")
    
    # Show some examples by book
    book_examples = defaultdict(list)
    for link in dead_links:
        if link['type'] == 'verse_out_of_range':
            book_examples[f"{link['book']}-{link['chapter']}"].append(link)
    
    print(f"\nTop problematic books/chapters:")
    for book_chapter in sorted(book_examples.keys(), key=lambda x: len(book_examples[x]), reverse=True)[:10]:
        print(f"  {book_chapter}: {len(book_examples[book_chapter])} dead links")
    
    # Save detailed report
    with open('dead_links_report_v2.txt', 'w') as f:
        f.write(f"Dead Verse Links Report (v2)\n")
        f.write(f"============================\n\n")
        f.write(f"Total references checked: {total_checked}\n")
        f.write(f"Dead links found: {len(dead_links)}\n\n")
        
        for link_type, links in by_type.items():
            f.write(f"\n{link_type.upper()} ({len(links)} links):\n")
            f.write("-" * 50 + "\n")
            for link in links[:20]:  # Show first 20 examples
                f.write(f"File: {link['lexicon_file']}\n")
                f.write(f"Reference: {link['book']}-{link['chapter']}:{link['verse']}\n")
                f.write(f"Link text: '{link['link_text']}'\n")
                f.write(f"Reason: {link['reason']}\n\n")
            
            if len(links) > 20:
                f.write(f"... and {len(links) - 20} more\n\n")
        
        f.write(f"\nTop problematic books/chapters:\n")
        for book_chapter in sorted(book_examples.keys(), key=lambda x: len(book_examples[x]), reverse=True)[:20]:
            f.write(f"{book_chapter}: {len(book_examples[book_chapter])} dead links\n")
    
    print("\nDetailed report saved to dead_links_report_v2.txt")
    return dead_links

if __name__ == "__main__":
    os.chdir('/tmp/novawebsite')
    dead_links = check_dead_links()