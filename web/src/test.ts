import { ANKI } from "./globals"

let cards = [
    {
        "cardId": 1550770945431,
        "tags": [
            "!AK_UpdateTags::^temporary::ImageFix::19",
            "!AK_UpdateTags::Step2decks::Cheesy-Dorian-(M3)::Internal-Medicine::1-OME",
            "!AK_Original_Decks::Step_2::Cheesy_Dorian_(M3)",
            "!AK_Step1_v12::!BnB::05_Cardio::03_EKGs::01_EKG_Basics",
            "!AK_Step1_v12::!OME::Clinical::Internal_Medicine",
            "!AK_Step1_v12::!Physeo::11_Pathology::01_Cardiac_Pathology::09_Basic_EKG_Interpretation",
            "!AK_Step2_v12::!Shelf::!Cards_AnKing_Skipped",
            "!AK_Step2_v12::!Shelf::IM::no_dupes",
            "!AK_Step2_v12::!Shelf::IM::no_dupes::only_step2",
            "!AK_Step2_v12::!BnB::02_Cardiology::01_Arrhythmias::02_ACLS_Tachycardias",
            "!AK_Step2_v12::!OME::01_Medicine::01_Cardiology::10_ACLS_Rhythms",
            "!AK_Step2_v12::!Resources_by_rotation::IM::ome::cardio::ecg",
            "!AK_Step2_v12::!SketchyIM::02_ECG_Interpretation_n_Arrhythmias::01_ECG_Basics::01_Electrocardiogram_(ECG)_Introduction",
            "!AK_Step2_v12::!Subjects::Cardiology::10_Arrhythmias::*Basics",
            "!AK_Step2_v12::Original_decks::Dorian::im::ome::cardio::ecg",
            "!PANCE::CARDIO::conduction_disorders/dysrhythmias",
            "!PANCE::EOR::IM",
            "ROTATIONS::IM"
        ]
    },
    {
        "cardId": 1555272165774,
        "tags": [
            "!AK_UpdateTags::^temporary::ImageFix::Table",
            "!AK_UpdateTags::Step2decks::Cheesy-Dorian-(M3)::Family-Medicine::1-OME::12",
            "!AK_Original_Decks::Step_2::Cheesy_Dorian_(M3)",
            "!AK_Step2_v12::!Shelf::!Cards_AnKing_Did::4fm",
            "!AK_Step2_v12::!Shelf::FM::no_dupes",
            "!AK_Step2_v12::!Shelf::FM::no_dupes::only_step2",
            "!AK_Step2_v12::!Shelf::IM::no_dupes",
            "!AK_Step2_v12::!Shelf::IM::no_dupes::only_step2",
            "!AK_Step2_v12::!BnB::02_Cardiology::02_Ischemic_Heart_Disease::01_Coronary_Artery_Disease",
            "!AK_Step2_v12::!OME::01_Medicine::01_Cardiology::01_Coronary_Artery_Disease",
            "!AK_Step2_v12::!OME::01_Medicine::01_Cardiology::02_Acute_Coronary_Syndrome",
            "!AK_Step2_v12::!OME::Clinical::01_Medicine::01_Cardiology::01_Coronary_Artery_Disease",
            "!AK_Step2_v12::!Resources_by_rotation::EM::nbme::form_1",
            "!AK_Step2_v12::!Resources_by_rotation::FM::nbme::form_3",
            "!AK_Step2_v12::!Resources_by_rotation::FM::ome::cardio::cad",
            "!AK_Step2_v12::!Resources_by_rotation::IM::emma",
            "!AK_Step2_v12::!Resources_by_rotation::IM::ome::cardio::cad",
            "!AK_Step2_v12::!SketchyIM::01_Cardiology::01_Ischemic_Heart_Disease::05_Unstable_Angina/NSTEMI",
            "!AK_Step2_v12::!Subjects::Cardiology::02_Coronary_Artery_Disease::Angina::Stress_Test",
            "!AK_Step2_v12::!Subjects::Cardiology::02_Coronary_Artery_Disease::Angina::Types::Unstable_Angina",
            "!AK_Step2_v12::!Subjects::Cardiology::02_Coronary_Artery_Disease::Procedures::PCI",
            "!AK_Step2_v12::Original_decks::Dorian::fam::ome::cardio::cad",
            "!AK_Step2_v12::Original_decks::Dorian::im::emma",
            "!AK_Step2_v12::Original_decks::Dorian::im::ome::cardio::cad",
            "!PANCE::CARDIO::coronary_artery_disease",
            "!PANCE::EOR::IM",
            "!PANCE::EOR::Surgery",
            "ROTATIONS::IM"
        ]
    }
]

export function processTags(cards) {

    const parseTag = (tag: string) => {
        return tag
            .replace(new RegExp(`${ANKI.BASE_CATEGORY_TAG}`, "g"), "")
            .replace(new RegExp('^::+|::+$', 'g'), '')
            .replace(/["_"]/g, " ")
            .split("::")
    }

    let processedCards = cards.map((card, index) => {
        const tagsOfInterest = card.tags.map(tag => {
            // If is a tag of interest
            if(tag.includes(ANKI.BASE_CATEGORY_TAG)) {
                return parseTag(tag)
            }
        }).filter(Boolean)

        card.tagsOfInterest = tagsOfInterest
        return card
    })
    return processedCards
}
let processedCards = processTags(cards)
console.log(processedCards)