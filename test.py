# from .thread import queryThread

# def testfunc(options):

# queryThread.exec(textfunc, options)

# from aqt import mw
# ids = mw.col.find_notes("deck:IM")

# notes = []
# for id in ids:
# 	note = mw.col.get_note(id)
# 	info = {}
# 	info["noteId"] = note.id
# 	info["answer"] = note.fields[1]
# 	info["tags"] = note.tags
# 	notes.append(info)

# print(notes[0])

# notes = [
#     {
#         "noteId": 1550797569712,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1550799383140,
#         "tag": ["Neurology", "Pharmacology"]
#     },
#     {
#         "noteId": 1550840310746,
#         "tag": ["Critical Care", "Infectious Disease"]
#     },
#     {
#         "noteId": 1550840966085,
#         "tag": ["Critical Care", "Infectious Disease"]
#     },
#     {
#         "noteId": 1550842808822,
#         "tag": ["Gastroenterology", "Hematology-Oncology"]
#     },
#     {
#         "noteId": 1550857480142,
#         "tag": ["Pulmonology", "Radiology"]
#     },
#     {
#         "noteId": 1550879209464,
#         "tag": ["Neurology", "Immunology"]
#     },
#     {
#         "noteId": 1550881505259,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1550944864586,
#         "tag": ["Neurology", "Radiology"]
#     },
#     {
#         "noteId": 1550966947921,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1550967269736,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1550968132425,
#         "tag": ["Pharmacology", "Pain Management"]
#     },
#     {
#         "noteId": 1550969391447,
#         "tag": ["Pain Management", "Addiction Medicine"]
#     },
#     {
#         "noteId": 1551024025440,
#         "tag": ["Gastroenterology"]
#     },
#     {
#         "noteId": 1551053816764,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1551144500061,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1551144569550,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1551223157186,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1555371708376,
#         "tag": ["Pulmonology", "Radiology"]
#     },
#     {
#         "noteId": 1555372585259,
#         "tag": ["Pulmonology"]
#     },
#     {
#         "noteId": 1555372805347,
#         "tag": ["Pulmonology"]
#     },
#     {
#         "noteId": 1555372981097,
#         "tag": ["Pulmonology", "Radiology"]
#     },
#     {
#         "noteId": 1555373156904,
#         "tag": ["Pulmonology", "Pharmacology"]
#     },
#     {
#         "noteId": 1555373382106,
#         "tag": ["Pulmonology"]
#     },
#     {
#         "noteId": 1555373523621,
#         "tag": ["Pulmonology"]
#     },
#     {
#         "noteId": 1555373646101,
#         "tag": ["Pulmonology", "Infectious Disease"]
#     },
#     {
#         "noteId": 1555373735339,
#         "tag": ["Pulmonology", "Oncology"]
#     },
#     {
#         "noteId": 1555434399648,
#         "tag": ["Gastroenterology"]
#     },
#     {
#         "noteId": 1555445134473,
#         "tag": ["Pulmonology"]
#     },
#     {
#         "noteId": 1555446762999,
#         "tag": ["Pulmonology"]
#     },
#     {
#         "noteId": 1555447532483,
#         "tag": ["Pulmonology", "Oncology"]
#     },
#     {
#         "noteId": 1555449656813,
#         "tag": ["Hepatology", "Gastroenterology"]
#     },
#     {
#         "noteId": 1555535736085,
#         "tag": ["Nephrology", "Cardiology"]
#     },
#     {
#         "noteId": 1555535884395,
#         "tag": ["Nephrology"]
#     },
#     {
#         "noteId": 1555536037634,
#         "tag": ["Nephrology"]
#     },
#     {
#         "noteId": 1555536071965,
#         "tag": ["Nephrology"]
#     },
#     {
#         "noteId": 1555549297496,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1555602433931,
#         "tag": ["Orthopedics"]
#     },
#     {
#         "noteId": 1555602668129,
#         "tag": ["Cardiology", "Pulmonology"]
#     },
#     {
#         "noteId": 1555622928317,
#         "tag": ["Hepatology"]
#     },
#     {
#         "noteId": 1555711834383,
#         "tag": ["Dermatology", "Oncology"]
#     },
#     {
#         "noteId": 1555719527977,
#         "tag": ["Endocrinology"]
#     },
#     {
#         "noteId": 1555719638350,
#         "tag": ["Endocrinology"]
#     },
#     {
#         "noteId": 1555719933670,
#         "tag": ["Endocrinology", "Oncology"]
#     },
#     {
#         "noteId": 1555721151310,
#         "tag": ["Endocrinology"]
#     },
#     {
#         "noteId": 1555721232419,
#         "tag": ["Endocrinology"]
#     },
#     {
#         "noteId": 1555753764794,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1555753868543,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1555754735858,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1551550883425,
#         "tag": ["Cardiology", "Gastroenterology"]
#     },
#     {
#         "noteId": 1551559303553,
#         "tag": ["Cardiology", "Pharmacology"]
#     },
#     {
#         "noteId": 1551574503339,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1551574866826,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1551612724574,
#         "tag": ["Pulmonology", "Critical Care"]
#     },
#     {
#         "noteId": 1551617026447,
#         "tag": ["Cardiology", "Infectious Disease"]
#     },
#     {
#         "noteId": 1551617892468,
#         "tag": ["Cardiology", "Critical Care"]
#     },
#     {
#         "noteId": 1551620149144,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1551745751805,
#         "tag": ["Endocrinology"]
#     },
#     {
#         "noteId": 1552128860131,
#         "tag": ["Endocrinology"]
#     },
#     {
#         "noteId": 1552131126029,
#         "tag": ["Endocrinology"]
#     },
#     {
#         "noteId": 1552143381121,
#         "tag": ["Neurology", "Pharmacology"]
#     },
#     {
#         "noteId": 1552146119592,
#         "tag": ["Endocrinology", "Pharmacology"]
#     },
#     {
#         "noteId": 1552265426510,
#         "tag": ["Infectious Disease"]
#     },
#     {
#         "noteId": 1552595474710,
#         "tag": ["Infectious Disease"]
#     },
#     {
#         "noteId": 1552602302285,
#         "tag": ["Infectious Disease", "Hematology-Oncology"]
#     },
#     {
#         "noteId": 1584133906347,
#         "tag": ["Neurology", "Oncology", "Radiology"]
#     },
#     {
#         "noteId": 1584215124471,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584215162788,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584215192470,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584215247599,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584215291955,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584215323638,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584230431307,
#         "tag": ["Toxicology"]
#     },
#     {
#         "noteId": 1584230461040,
#         "tag": ["Hepatology"]
#     },
#     {
#         "noteId": 1584230849300,
#         "tag": ["Endocrinology", "Pharmacology"]
#     },
#     {
#         "noteId": 1584231558733,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 

# 1584231692056,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1584232254058,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1584232271097,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1584232760853,
#         "tag": ["Pulmonology", "Infectious Disease"]
#     },
#     {
#         "noteId": 1584232794886,
#         "tag": ["Pulmonology", "Pharmacology"]
#     },
#     {
#         "noteId": 1584232950114,
#         "tag": ["Cardiology"]
#     },
#     {
#         "noteId": 1584232981575,
#         "tag": ["Pulmonology", "Critical Care"]
#     },
#     {
#         "noteId": 1584233005687,
#         "tag": ["Pulmonology"]
#     },
#     {
#         "noteId": 1584233033158,
#         "tag": ["Pulmonology"]
#     },
#     {
#         "noteId": 1584233214053,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584233267315,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584233723890,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584233799234,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234268350,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234303908,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234331542,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234412353,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234453760,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234512998,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234582070,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234614432,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234652496,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234765790,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234813251,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234844214,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234891725,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584234968725,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235030971,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235150104,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235253840,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235372767,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235447682,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235516571,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235558750,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235606553,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235639782,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235673977,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235723486,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235754632,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235791446,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235827352,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235861604,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235895302,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235928030,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584235958936,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236003233,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236040931,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236090958,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236122330,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236161130,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236201115,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236256930,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236297891,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236347902,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236397883,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236429941,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236463744,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236501751,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236539245,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236581633,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236622657,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236660404,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236703342,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236744871,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236792082,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236829444,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236866864,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236905543,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236943531,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584236982077,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237017826,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237057583,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237100077,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237138552,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237175375,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237211782,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237254412,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237291210,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237331464,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237374214,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237415683,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237456421,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237499482,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237538855,
#         "tag": ["Neurology"]
#     },
#     {
#         "noteId": 1584237582428,
#         "tag": ["Neurology"]
#     }
# ]

# print(notes)
    

[
    {"noteId": "1368291917470", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology"},
    {"noteId": "1368292311289", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology"},
    {"noteId": "1368292340959", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology"},
    {"noteId": "1402524179050", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1403023387767", "tag": "#AK_Step2_v12::#OME::01_Medicine::06_Infectious_Disease"},
    {"noteId": "1454979345234", "tag": "#AK_Step2_v12::#OME::01_Medicine"},
    {"noteId": "1461880585745", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1462038674313", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::03_Heart_Failure"},
    {"noteId": "1462133757332", "tag": "#AK_Step2_v12::#OME::01_Medicine::04_Nephrology::04_Calcium"},
    {"noteId": "1462209828585", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1462219961995", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1462327377004", "tag": "#AK_Step2_v12::#OME::01_Medicine::06_Infectious_Disease"},
    {"noteId": "1462327432810", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1462327441833", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1462380873616", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1462381638330", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1462381654555", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1463176780906", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1463176789917", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1463529453311", "tag": "#AK_Step2_v12::#OME::01_Medicine::07_Endocrinology"},
    {"noteId": "1463675416618", "tag": "#AK_Step2_v12::#OME::01_Medicine"},
    {"noteId": "1463844549067", "tag": "#AK_Step2_v12::#OME::01_Medicine::04_Nephrology"},
    {"noteId": "1468250145227", "tag": "#AK_Step2_v12::#OME::01_Medicine::02_Pulmonology"},
    {"noteId": "1471294366999", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology"},
    {"noteId": "1471547618307", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology"},
    {"noteId": "1471806426564", "tag": "#AK_Step2_v12::#OME::01_Medicine::02_Pulmonology"},
    {"noteId": "1471824868294", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology"},
    {"noteId": "1471880481754", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::01_Coronary_Artery_Disease"},
    {"noteId": "1471899439284", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1472058882618", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::04_Valvular_Disease"},
    {"noteId": "1472072107763", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1472072110576", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1472072115600", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1472072140715", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1472072164834", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1472072206743", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1472078827800", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::05_Cardiomyopathy"},
    {"noteId": "1472147010726", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::04_Valvular_Disease"},
    {"noteId": "1472147368524", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology"},
    {"noteId": "1472147713025", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::10_ACLS_Rhythms"},
    {"noteId": "1472161233950", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1472161271695", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1472161282900", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::06_Pericardial_Disease"},
    {"noteId": "1472265205487", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::05_Cardiomyopathy"},
    {"noteId": "1472487609656", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::05_Cardiomyopathy"},
    {"noteId": "1472487618672", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::05_Cardiomyopathy"},
    {"noteId": "1472487628664", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::05_Cardiomyopathy"},
    {"noteId": "1472612051677", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::10_ACLS_Rhythms"},
    {"noteId": "1473375565346", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::10_ACLS_Rhythms"},
    {"noteId": "1473375621493", "tag": "#AK_Step2_v12::#OME::01_Medicine::01_Cardiology::10_ACLS_Rhythms"}
]