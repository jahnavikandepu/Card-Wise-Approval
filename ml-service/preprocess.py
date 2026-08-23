import pandas as pd

# pyrefly: ignore [missing-import]
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

# Dataset Selected Features
NUMERICAL_FEATURES = ['Age', 'Debt', 'YearsEmployed', 'CreditScore', 'Income']
BINARY_FEATURES = ['Gender', 'Married', 'BankCustomer', 'PriorDefault', 'Employed', 'DriversLicense']
CATEGORICAL_FEATURES = ['Industry', 'Ethnicity', 'Citizen']
FEATURE_COLUMNS = NUMERICAL_FEATURES + BINARY_FEATURES + CATEGORICAL_FEATURES
EXCLUDED_COLUMNS = ['ZipCode', 'Approved']

def build_cardwise_preprocessor():
    """
    Constructs a ColumnTransformer that handles:
    1. Numerical features: Median imputation + StandardScaler
    2. Binary features: Mode imputation
    3. Categorical features: Most frequent imputation + OneHotEncoder with handle_unknown='ignore'
    """
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    binary_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent'))
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, NUMERICAL_FEATURES),
            ('bin', binary_transformer, BINARY_FEATURES),
            ('cat', categorical_transformer, CATEGORICAL_FEATURES)
        ],
        remainder='drop'
    )

    return preprocessor

def map_frontend_payload_to_ml_features(payload: dict) -> pd.DataFrame:
    """
    Maps CardWise frontend application payload into exact ML dataset features.
    """
    # 1. Gender: Male -> 1, Female/Other -> 0
    gender_val = 1 if str(payload.get('gender', 'Male')).lower() == 'male' else 0
    
    # 2. Age
    try:
        age_val = float(payload.get('age') or 30.0)
    except (ValueError, TypeError):
        age_val = 30.0

    # 3. Income (Annual Income scaled to dataset scale or direct income)
    raw_income = float(payload.get('annualIncome') or 600000)
    # In dataset, Income has median 5, mean 1017, max 100000. We scale annual income:
    income_val = raw_income / 1000.0 if raw_income > 1000 else raw_income

    # 4. Debt (Expenses / Monthly Income ratio * 10, existing loans, and revolving credit utilization burden)
    monthly_inc = float(payload.get('monthlyIncome') or (raw_income / 12) or 50000)
    expenses = float(payload.get('monthlyExpenses') or 20000)
    loans = float(payload.get('existingLoans') or 0)
    dependents = float(payload.get('dependents') or 0)
    utilization = float(payload.get('creditUtilization') or 25.0)
    
    # Debt metric combines fixed expense ratio, active loan burden, and revolving utilization load
    base_debt = (expenses / monthly_inc * 10) if monthly_inc > 0 else 4.0
    loan_debt = loans * 1.8
    util_debt = (max(0.0, utilization - 30.0) / 20.0)
    dep_debt = min(2.0, dependents * 0.4)
    debt_val = round(base_debt + loan_debt + util_debt + dep_debt, 2)

    # 5. Married
    married_val = 1 if str(payload.get('maritalStatus', 'Single')).lower() in ['married', '1', 'true'] else 0

    # 6. Bank Customer
    bank_cust_val = 1

    # 7. Industry (derived from educationLevel / explicit industry)
    edu = str(payload.get('education') or payload.get('educationLevel') or '').lower()
    if 'doctorate' in edu or 'phd' in edu or 'master' in edu:
        industry_val = payload.get('industry') or 'Education'
    elif 'professional' in edu:
        industry_val = payload.get('industry') or 'Financials'
    else:
        industry_val = payload.get('industry') or 'Industrials'

    # 8. Ethnicity
    ethnicity_val = payload.get('ethnicity') or 'White'

    # 9. Years Employed
    try:
        years_emp_val = float(payload.get('employmentYears') or 3.0)
    except (ValueError, TypeError):
        years_emp_val = 3.0

    # 10. Prior Credit Record (In dataset A9/PriorDefault, 1 represents established/clean credit track record, 0 represents no prior record/adverse history)
    prev_defaults = str(payload.get('previousDefaults', 'no')).lower()
    has_defaults = prev_defaults in ['yes', 'true', '1']
    credit_hist_len = float(payload.get('creditHistoryLength') or payload.get('creditHistory') or 1.0)
    # Severe utilization (>85%) or past defaults indicate negative credit history
    prior_default_val = 1 if (not has_defaults and credit_hist_len >= 0.5 and utilization < 85) else 0

    # 11. Employed status: 1 if employed full/part/self, 0 otherwise
    emp_status = str(payload.get('employmentStatus', 'Employed Full-Time')).lower()
    employed_val = 0 if ('student' in emp_status or 'unemployed' in emp_status or 'retired' in emp_status) else 1

    # 12. Credit Score (In dataset, CreditScore ranges 0 - 67 with mean 2.4; we map 300-850 range to dataset index)
    raw_cs = float(payload.get('creditScore') or 720)
    if raw_cs >= 300:
        cs_val = max(0.0, min(25.0, (raw_cs - 550) / 12.0))
    else:
        cs_val = max(0.0, raw_cs)

    # 13. Drivers License
    drivers_license_val = 1

    # 14. Citizen
    citizen_val = payload.get('citizen') or 'ByBirth'

    row = {
        'Gender': gender_val,
        'Age': age_val,
        'Debt': debt_val,
        'Married': married_val,
        'BankCustomer': bank_cust_val,
        'Industry': industry_val,
        'Ethnicity': ethnicity_val,
        'YearsEmployed': years_emp_val,
        'PriorDefault': prior_default_val,
        'Employed': employed_val,
        'CreditScore': cs_val,
        'DriversLicense': drivers_license_val,
        'Citizen': citizen_val,
        'Income': income_val
    }

    return pd.DataFrame([row])
