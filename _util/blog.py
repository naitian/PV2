import pystache

template = open('_templates/blog.mustache').read()

title = input('Post Title: ')
author = input('Author (Naitian Zhou):')
if author == '':
    author = 'Naitian Zhou'
cover = input('Cover Image File: ')
desc = input('Description: ')

tags = []

while True:
    tag = input('Tags (q to finish): ')
    if tag == 'q' or tag == '':
        break
    tags.append({'name': tag})

final = open('../_drafts/' + title.lower(), 'w')

obj = {
    'title': title,
    'author': author,
    'cover': cover,
    'desc': desc,
    'tag': tags
}

final.write(pystache.render(template, obj))
