import json

def test_api():
    print("Testing JanSwar API locally...")
    from backend.services.scheme_search import search_schemes, get_all_categories
    from backend.services.eligibility_engine import check_all_schemes_eligibility
    from backend.services.ai_assistant import generate_voice_assistant_response, process_conversational_turn

    # Test 1: Category list
    cats = get_all_categories()
    print(f"Categories count: {len(cats)} -> {cats}")
    assert len(cats) >= 7

    # Test 2: State-wise scheme search (Maharashtra)
    mh_schemes = search_schemes(state="Maharashtra")
    print(f"Schemes for Maharashtra & All India: {len(mh_schemes)}")
    assert len(mh_schemes) >= 15

    # Test 3: Multi-turn Interactive Voice Interview in Marathi
    # Turn 1: Citizen asks for pension in Marathi
    t1 = process_conversational_turn(
        transcript="मला पेन्शन हवी आहे",
        state="Maharashtra",
        language_code="mr-IN",
        language_name="Marathi"
    )
    print(f"Marathi Interview Step 1: {t1['current_step']} | Audio: {t1['audio_url']}")
    assert t1['current_step'] == "ask_age"
    assert t1['audio_url'] is not None

    # Turn 2: Citizen answers age
    t2 = process_conversational_turn(
        transcript="माझे वय ६५ वर्षे आहे",
        state="Maharashtra",
        language_code="mr-IN",
        language_name="Marathi",
        stage=t1['current_step'],
        user_profile=t1['collected_profile']
    )
    print(f"Marathi Interview Step 2: {t2['current_step']} | Profile: {t2['collected_profile']}")
    assert t2['collected_profile']['age'] == 65

    # Turn 3: Citizen answers income & ration card
    t3 = process_conversational_turn(
        transcript="वार्षिक उत्पन्न ५० हजार आहे आणि पिवळे रेशन कार्ड आहे",
        state="Maharashtra",
        language_code="mr-IN",
        language_name="Marathi",
        stage=t2['current_step'],
        user_profile=t2['collected_profile']
    )
    print(f"Marathi Interview Step 3: {t3['current_step']} | Profile: {t3['collected_profile']}")

    # Turn 4: Citizen answers occupation -> Sanctioned Verdict
    t4 = process_conversational_turn(
        transcript="मी ज्येष्ठ नागरिक आहे",
        state="Maharashtra",
        language_code="mr-IN",
        language_name="Marathi",
        stage=t3['current_step'],
        user_profile=t3['collected_profile']
    )
    print(f"Marathi Interview Step 4 Verdict: {t4['current_step']} | Matched: {len(t4['matched_schemes'])} | Audio: {t4['audio_url']}")
    assert t4['current_step'] == "complete"
    assert len(t4['matched_schemes']) >= 2

    # Test 4: Multi-turn Interactive Voice Interview in Tamil
    t1_ta = process_conversational_turn(
        transcript="எனக்கு ஓய்வூதியம் வேண்டும்",
        state="Tamil Nadu",
        language_code="ta-IN",
        language_name="Tamil"
    )
    print(f"Tamil Interview Step 1: {t1_ta['current_step']} | Audio: {t1_ta['audio_url']}")
    assert t1_ta['current_step'] == "ask_age"

    print("\nALL JAN SWAR INTERACTIVE REGIONAL VOICE TESTS PASSED SUCCESSFULLY! 🚀")

if __name__ == "__main__":
    test_api()
