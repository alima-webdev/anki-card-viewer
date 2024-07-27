from aqt import mw

baseTag = "#AK_Step2_v12::#OME::01_Medicine::"

# Get the tags of interest and convert them to the final format
# tagsOfInterest = []
# tags = mw.col.tags.all()
# for i in 0..tags.count:
#     if(tags[i].startswith(baseTag)):
#         tag = tags[i].replace(baseTag, "ROTATIONS::IM::")
#         tagsOfInterest.append(tag)

# Get note ids
query = "deck:IM"
ids = mw.col.find_notes(query)

# Add tags
for id in ids:
    note = mw.col.get_note(id)
    
    for tag in note.tags:
        if(tag.startswith(baseTag)):
            customTag = tag.replace(baseTag, "ROTATIONS::IM::")
            note.add_tag(customTag)
            note.flush()


mw.col.autosave()
