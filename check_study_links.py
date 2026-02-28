#!/usr/bin/env python3

import os
import re
import glob

def check_study_internal_links():
    """Check all internal links in study files."""
    study_files = glob.glob('studies/*.html')
    broken_links = []
    total_links_checked = 0
    
    print(f"Checking internal links in {len(study_files)} study files...")
    
    for study_file in study_files:
        try:
            with open(study_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find Strong's references
            strongs_pattern = r'href="../lexicon/([gh]\d+)\.html"'
            strongs_matches = re.findall(strongs_pattern, content)
            
            for strongs_ref in strongs_matches:
                total_links_checked += 1
                lexicon_file = f"lexicon/{strongs_ref}.html"
                if not os.path.exists(lexicon_file):
                    broken_links.append({
                        'type': 'missing_strongs',
                        'study': study_file,
                        'reference': strongs_ref,
                        'target': lexicon_file
                    })
            
            # Find interlinear verse references
            interlinear_pattern = r'href="../interlinear/([a-z0-9]+-\d+)\.html"'
            interlinear_matches = re.findall(interlinear_pattern, content)
            
            for interlinear_ref in interlinear_matches:
                total_links_checked += 1
                interlinear_file = f"interlinear/{interlinear_ref}.html"
                if not os.path.exists(interlinear_file):
                    broken_links.append({
                        'type': 'missing_interlinear',
                        'study': study_file,
                        'reference': interlinear_ref,
                        'target': interlinear_file
                    })
        
        except Exception as e:
            print(f"Error reading {study_file}: {e}")
    
    print(f"\nResults:")
    print(f"Total links checked: {total_links_checked}")
    print(f"Broken links found: {len(broken_links)}")
    
    if broken_links:
        print(f"\nBroken links by type:")
        by_type = {}
        for link in broken_links:
            link_type = link['type']
            if link_type not in by_type:
                by_type[link_type] = []
            by_type[link_type].append(link)
        
        for link_type, links in by_type.items():
            print(f"  {link_type}: {len(links)}")
            for link in links[:5]:  # Show first 5 examples
                print(f"    {link['study']} -> {link['reference']}")
            if len(links) > 5:
                print(f"    ... and {len(links) - 5} more")
    else:
        print("✅ All study internal links are working correctly!")
    
    return broken_links

if __name__ == "__main__":
    os.chdir('/tmp/novawebsite')
    broken_links = check_study_internal_links()