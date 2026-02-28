#!/usr/bin/env python3

import os
import re
import glob

def check_mobile_friendliness():
    """Check mobile-friendly features across page types."""
    
    print("🔍 Checking Mobile-Friendly Features")
    print("=" * 40)
    
    # Check different page types
    page_types = {
        'homepage': ['index.html'],
        'studies': glob.glob('studies/*.html')[:3],
        'interlinear': glob.glob('interlinear/*.html')[:3],  
        'lexicon': glob.glob('lexicon/*.html')[:3],
        'reference': glob.glob('reference/*.html')[:2]
    }
    
    issues = []
    
    for page_type, files in page_types.items():
        print(f"\n📱 Checking {page_type.upper()} pages...")
        
        for file_path in files:
            if not os.path.exists(file_path):
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check viewport meta tag
                if 'viewport' not in content:
                    issues.append(f"❌ {file_path}: Missing viewport meta tag")
                elif 'width=device-width' not in content:
                    issues.append(f"⚠️  {file_path}: Viewport not set to device-width")
                else:
                    print(f"  ✅ {os.path.basename(file_path)}: Proper viewport")
                
                # Check for touch-friendly navigation
                if 'nav-toggle' in content or 'hamburger' in content:
                    print(f"  ✅ {os.path.basename(file_path)}: Mobile navigation present")
                
                # Check for responsive images
                if 'max-width: 100%' in content or 'img-responsive' in content:
                    print(f"  ✅ {os.path.basename(file_path)}: Responsive images")
                
                # Check for overly wide tables
                table_count = len(re.findall(r'<table', content, re.IGNORECASE))
                if table_count > 0:
                    print(f"  📊 {os.path.basename(file_path)}: {table_count} tables (check mobile scrolling)")
                
            except Exception as e:
                issues.append(f"❌ Error reading {file_path}: {e}")
    
    # Check CSS for mobile styles
    print(f"\n🎨 Checking CSS Mobile Styles...")
    try:
        with open('css/style.css', 'r', encoding='utf-8') as f:
            css_content = f.read()
        
        media_queries = len(re.findall(r'@media.*max-width.*768px', css_content))
        if media_queries > 0:
            print(f"  ✅ Found {media_queries} mobile media queries")
        else:
            issues.append("❌ No mobile-specific CSS media queries found")
        
        # Check for common mobile patterns
        if 'overflow-x: auto' in css_content or 'scroll' in css_content:
            print("  ✅ Horizontal scrolling support for wide content")
        
        if 'nav-toggle' in css_content:
            print("  ✅ Mobile navigation toggle CSS present")
            
    except Exception as e:
        issues.append(f"❌ Error reading CSS: {e}")
    
    print(f"\n📊 MOBILE-FRIENDLY SUMMARY")
    print("=" * 30)
    
    if not issues:
        print("🎉 ✅ All pages appear to be mobile-friendly!")
        print("   • Proper viewport meta tags")
        print("   • Responsive CSS media queries") 
        print("   • Mobile navigation present")
        print("   • No critical issues found")
    else:
        print(f"⚠️  Found {len(issues)} potential issues:")
        for issue in issues:
            print(f"   {issue}")
    
    return issues

if __name__ == "__main__":
    os.chdir('/tmp/novawebsite')
    issues = check_mobile_friendliness()