#!/usr/bin/env python3
"""
Process cross-reference data from OpenBible.info into JSON format
with OSIS-style book abbreviations for the biblical study website.
"""

import json
import re
from collections import defaultdict

# Mapping from OpenBible.info abbreviations to OSIS-style abbreviations
BOOK_MAPPING = {
    # Old Testament
    'Gen': 'gen', 'Exod': 'exo', 'Lev': 'lev', 'Num': 'num', 'Deut': 'deu',
    'Josh': 'jos', 'Judg': 'jdg', 'Ruth': 'rut', '1Sam': '1sa', '2Sam': '2sa',
    '1Kings': '1ki', '2Kings': '2ki', '1Chron': '1ch', '2Chron': '2ch',
    'Ezra': 'ezr', 'Neh': 'neh', 'Esth': 'est', 'Job': 'job', 'Ps': 'psa',
    'Prov': 'pro', 'Eccl': 'ecc', 'Song': 'sng', 'Isa': 'isa', 'Jer': 'jer',
    'Lam': 'lam', 'Ezek': 'ezk', 'Dan': 'dan', 'Hos': 'hos', 'Joel': 'jol',
    'Amos': 'amo', 'Obad': 'oba', 'Jonah': 'jon', 'Mic': 'mic', 'Nah': 'nam',
    'Hab': 'hab', 'Zeph': 'zep', 'Hag': 'hag', 'Zech': 'zec', 'Mal': 'mal',
    
    # New Testament
    'Matt': 'mat', 'Mark': 'mrk', 'Luke': 'luk', 'John': 'jhn', 'Acts': 'act',
    'Rom': 'rom', '1Cor': '1co', '2Cor': '2co', 'Gal': 'gal', 'Eph': 'eph',
    'Phil': 'php', 'Col': 'col', '1Thess': '1th', '2Thess': '2th',
    '1Tim': '1ti', '2Tim': '2ti', 'Titus': 'tit', 'Philem': 'phm',
    'Heb': 'heb', 'James': 'jas', '1Pet': '1pe', '2Pet': '2pe',
    '1John': '1jn', '2John': '2jn', '3John': '3jn', 'Jude': 'jud', 'Rev': 'rev'
}

def convert_reference(ref_str):
    """Convert a reference like 'Gen.1.1' or 'Psa.33.6-Psa.33.9' to OSIS format."""
    if not ref_str:
        return None
        
    # Handle range references like "Psa.33.6-Psa.33.9"
    if '-' in ref_str:
        # For ranges, we'll just use the first reference for simplicity
        # as the website format seems to prefer individual verse references
        ref_str = ref_str.split('-')[0]
    
    # Parse book.chapter.verse format
    parts = ref_str.split('.')
    if len(parts) != 3:
        return None
        
    book, chapter, verse = parts
    
    # Convert book name to OSIS format
    if book not in BOOK_MAPPING:
        print(f"Warning: Unknown book abbreviation: {book}")
        return None
        
    osis_book = BOOK_MAPPING[book]
    return f"{osis_book}.{chapter}.{verse}"

def main():
    """Process the cross-reference file and create JSON output."""
    cross_refs = defaultdict(list)
    unknown_books = set()
    processed_count = 0
    skipped_count = 0
    
    print("Processing cross-reference data...")
    
    with open('cross_references.txt', 'r', encoding='utf-8') as f:
        # Skip header line
        next(f)
        
        for line_num, line in enumerate(f, 2):
            line = line.strip()
            if not line:
                continue
                
            parts = line.split('\t')
            if len(parts) < 3:
                continue
                
            from_verse, to_verse, votes_str = parts[0], parts[1], parts[2]
            
            try:
                votes = int(votes_str)
            except ValueError:
                votes = 0
            
            # Convert references to OSIS format
            from_ref = convert_reference(from_verse)
            to_ref = convert_reference(to_verse)
            
            if from_ref and to_ref:
                # Only include cross-references with positive votes
                if votes > 0:
                    cross_refs[from_ref].append(to_ref)
                    processed_count += 1
                else:
                    skipped_count += 1
            else:
                skipped_count += 1
                # Track unknown books for debugging
                for ref in [from_verse, to_verse]:
                    if ref and '.' in ref:
                        book = ref.split('.')[0]
                        if book not in BOOK_MAPPING:
                            unknown_books.add(book)
            
            if line_num % 50000 == 0:
                print(f"Processed {line_num:,} lines...")
    
    print(f"Processing complete!")
    print(f"Total cross-references processed: {processed_count:,}")
    print(f"Entries skipped: {skipped_count:,}")
    print(f"Unique verses with cross-references: {len(cross_refs):,}")
    
    if unknown_books:
        print(f"Unknown book abbreviations found: {sorted(unknown_books)}")
    
    # Convert defaultdict to regular dict and sort the lists
    final_cross_refs = {}
    for verse, refs in cross_refs.items():
        # Remove duplicates and sort
        unique_refs = sorted(list(set(refs)))
        final_cross_refs[verse] = unique_refs
    
    # Write JSON output
    print("Writing JSON file...")
    with open('cross_references.json', 'w', encoding='utf-8') as f:
        json.dump(final_cross_refs, f, indent=2, sort_keys=True)
    
    # Get file size
    import os
    file_size = os.path.getsize('cross_references.json')
    file_size_mb = file_size / (1024 * 1024)
    
    print(f"Output written to cross_references.json")
    print(f"File size: {file_size:,} bytes ({file_size_mb:.1f} MB)")
    
    # Show some sample entries
    print("\nSample entries:")
    count = 0
    for verse, refs in sorted(final_cross_refs.items()):
        if count >= 5:
            break
        print(f"  {verse}: {refs[:5]}{'...' if len(refs) > 5 else ''} ({len(refs)} total)")
        count += 1

if __name__ == '__main__':
    main()