"""
import textdistance

tagsOfInterest = [
    "01 Cardiology",
    "02 Pulmonology",
    # "#AK_Step2_v12::#OME::Clinical::01_Medicine::01_Cardiology",
    # "#AK_Step2_v12::#OME::Clinical::01_Medicine::02_Pulmonology"
]

tags = [
    "!AK_UpdateTags::^temporary::ImageFix::22::done",
    "!AK_UpdateTags::Step2decks::Cheesy-Dorian-(M3)::Family-Medicine::1-OME::13",
    "#AK_Original_Decks::Step_2::Cheesy_Dorian_(M3)",
    "#AK_Other::Card_Features::^One_By_One",
    "#AK_Step2_v12::!Shelf::#Cards_AnKing_Did::4fm",
    "#AK_Step2_v12::!Shelf::FM::no_dupes",
    "#AK_Step2_v12::!Shelf::FM::no_dupes::only_step2",
    "#AK_Step2_v12::!Shelf::IM::no_dupes",
    "#AK_Step2_v12::!Shelf::IM::no_dupes::only_step2",
    "#AK_Step2_v12::#B&B::14_Pulmonary_Critical_Care::01_Pulmonary_Disease::02_Asthma",
    "#AK_Step2_v12::#OME::01_Medicine::02_Pulmonology::01_Asthma",
    # "#AK_Step2_v12::#OME::Clinical::01_Medicine::02_Pulmonology::01_Asthma",
    "#AK_Step2_v12::#Resources_by_rotation::FM::ome::pulm::asthma",
    "#AK_Step2_v12::#Resources_by_rotation::IM::ome::pulm::asthma",
    "#AK_Step2_v12::#Subjects::Pulmonology::05_Lungs::Obstructive_Lung_Disease::Asthma",
    "#AK_Step2_v12::#Subjects::Pulmonology::05_Lungs::Obstructive_Lung_Disease::Asthma::Management_Redo",
    "#AK_Step2_v12::Original_decks::Dorian::fam::ome::pulm::asthma",
    "#AK_Step2_v12::Original_decks::Dorian::im::ome::pulm::asthma",
    "#PANCE::PULM::obstructive_pulmonary_diseases",
    "AnkiHub_ImageReady::Extra",
    "AnkiHub_ImageReady::Text",
    "ROTATIONS::IM",
]

processedTags = []
for tag in tags:
    processedTags = processedTags + tag.split("::")

processedTags = list(set(processedTags))

distances = []

# distance = textdistance.hamming(tags[0], tagsOfInterest[0])
for tag in processedTags:
    for tagOfInterest in tagsOfInterest:
        distance = textdistance.hamming(tag, tagOfInterest)
        distanceJaro = textdistance.jaro(tag, tagOfInterest)
        distanceObj = {}
        distanceObj["tag"] = tag
        distanceObj["tagOfInterest"] = tagOfInterest
        distanceObj["distanceHamming"] = distance
        distanceObj["distanceJaro"] = distanceJaro
        distances.append(distanceObj)

for d in distances:
    print(d)
    print("")

# print("CATEGORY: ")
# print(max(distances, key=lambda x: x["distanceJaro"]))

"""


nSubCategories = 2
tagOfInterest = "blah::test::123::456"

tagOfInterestParsed = "::".join(tagOfInterest.split("::")[0:2])

print(tagOfInterestParsed)