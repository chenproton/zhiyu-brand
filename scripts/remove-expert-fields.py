import re

with open('/root/zhiyu-brand/lib/mock-data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the experts array section
start_marker = 'export const experts: Expert[] = ['
start = content.find(start_marker)
if start == -1:
    print("Experts array not found")
    exit(1)

# Find the end of experts array (next export const after start)
end_match = re.search(r'\nexport const \w+', content[start + len(start_marker):])
if end_match:
    end = start + len(start_marker) + end_match.start()
else:
    end = len(content)

before = content[:start]
section = content[start:end]
after = content[end:]

lines = section.split('\n')
new_lines = []
in_roles = False
in_achievements = False
skip_depth = 0

for line in lines:
    stripped = line.strip()
    
    # Track if we're inside a nested array
    if stripped.startswith('roles:'):
        in_roles = True
        skip_depth = stripped.count('[') - stripped.count(']')
        if skip_depth <= 0:
            in_roles = False
        continue
    
    if stripped.startswith('achievements:'):
        in_achievements = True
        skip_depth = stripped.count('[') - stripped.count(']')
        if skip_depth <= 0:
            in_achievements = False
        continue
    
    if in_roles or in_achievements:
        skip_depth += stripped.count('[') - stripped.count(']')
        if skip_depth <= 0:
            in_roles = False
            in_achievements = False
        continue
    
    if stripped.startswith('field:'):
        continue
    
    new_lines.append(line)

new_section = '\n'.join(new_lines)
content = before + new_section + after

with open('/root/zhiyu-brand/lib/mock-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done removing field/roles/achievements from experts")
