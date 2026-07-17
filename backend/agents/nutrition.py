from langchain.tools import tool
from typing import List

@tool("generate_nutrition_guidance")
def generate_nutrition_advice(clinical_flags: List[str], weather_condition: str):
    """
    Generates personalized nutrition and wellness advice based on clinical risks and environmental conditions.
    """
    advice = []

    if "Heatwave" in weather_condition or "Heat" in weather_condition:
        advice.append("EXTREME HEAT WARNING: Increase hydration immediately. Drink at least 3-4 liters of water.")
        advice.append("Avoid outdoor activities between 11 AM and 4 PM.")
        advice.append("Wear loose, light-colored cotton clothing.")

    for flag in clinical_flags:
        if "Hypertension" in flag:
            advice.append("Reduce salt intake to < 5g per day.")
            advice.append("Avoid processed foods, pickles, and papads.")
            advice.append("Incorporate potassium-rich foods like bananas and spinach.")
        if "Anemia" in flag:
            advice.append("Increase iron intake: Eat leafy greens, jaggery, dates, and legumes.")
            advice.append("Combine iron-rich foods with Vitamin C (lemon, amla) for better absorption.")
            advice.append("Avoid tea/coffee immediately after meals.")
        if "Glucose" in flag or "Diabetes" in flag:
            advice.append("Switch to low glycemic index foods (whole grains, oats).")
            advice.append("Avoid direct sugars, sweets, and sweetened beverages.")
            advice.append("Eat small, frequent meals rather than large heavy meals.")
            
    if not advice:
        advice.append("Maintain a balanced diet with plenty of seasonal vegetables and fruits.")
        advice.append("Continue standard prenatal supplements as prescribed.")
        
    return advice
