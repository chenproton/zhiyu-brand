import re

with open('/root/zhiyu-brand/lib/mock-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove all incorrectly added secondaryCollege lines
content = re.sub(r"\n\s+secondaryCollege: '[^']*',", "", content)

colleges = [
    '智能制造学院',
    '信息技术学院',
    '经济管理学院',
    '艺术设计学院',
    '新能源工程学院',
    '生物医药学院',
    '现代服务学院',
    '国际教育学院',
    '创新创业学院',
]

def add_to_array_section(content, array_name):
    pattern = rf"(export const {array_name}: \w+\[\] = \[)"
    match = re.search(pattern, content)
    if not match:
        print(f"Array {array_name} not found")
        return content
    
    start = match.start()
    # Find the [ after = 
    bracket_start = content.find('= [', start)
    if bracket_start == -1:
        print(f"Array {array_name}: could not find = [")
        return content
    bracket_start += 2
    
    depth = 1
    pos = bracket_start + 1
    while depth > 0 and pos < len(content):
        if content[pos] == '[':
            depth += 1
        elif content[pos] == ']':
            depth -= 1
        pos += 1
    end = pos
    
    section = content[start:end]
    
    lines = section.split('\n')
    new_lines = []
    brace_depth = 0
    obj_count = 0
    
    for line in lines:
        stripped = line.strip()
        brace_depth += stripped.count('{')
        brace_depth -= stripped.count('}')
        
        new_lines.append(line)
        
        if brace_depth == 1 and stripped.startswith('createdAt:'):
            college = colleges[obj_count % len(colleges)]
            indent = line[:len(line) - len(line.lstrip())]
            new_lines.insert(-1, f"{indent}secondaryCollege: '{college}',")
            obj_count += 1
    
    new_section = '\n'.join(new_lines)
    content = content[:start] + new_section + content[end:]
    print(f"Array {array_name}: added {obj_count} secondaryCollege fields")
    return content

content = add_to_array_section(content, 'enterprises')
content = add_to_array_section(content, 'experts')
content = add_to_array_section(content, 'projects')
content = add_to_array_section(content, 'achievements')

with open('/root/zhiyu-brand/lib/mock-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
