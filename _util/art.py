import pystache

template = open('../_templates/art.mustache').read()

title = input('Post Title: ')
img = input('Image File: ')
desc = input('Description: ')

others = []

while True:
    src = input('Other File (q to finish): ')
    if src == 'q' or src == '':
        break
    others.append({'file': src})

final = open('../_art/' + title.lower(), 'w')

obj = {
    'title': title,
    'img': img,
    'desc': desc,
    'other': others
}

final.write(pystache.render(template, obj))
