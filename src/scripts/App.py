#imports

from flask import Flask, jsonify, request
import re
import numpy as np
from flask_cors import CORS
from pandas import read_csv
import math
from fractions import Fraction
from collections import defaultdict
from scipy.optimize import lsq_linear
from math import gcd
from functools import reduce
from numpy.linalg import lstsq
import logging

# Configure flask app

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/')
def home():
    return "Hello, World!"
    
'''
@app.route('/api', methods=['GET'])
def index():
    return jsonify({"message": "Hello from Flask on Vercel!"})

# Vercel requires a callable named 'app' for the entry point
def handler(request, *args, **kwargs):
    return app(request, *args, **kwargs)
    '''

#Titrations pH

def parse_to_float(value):
    try:
        return float(value)
    except ValueError:
        return None

def round_to_sig_figs(value, sig_figs):
    if value == 0:
        return 0
    def check(value,sig_figs):
      if(value < 1):
        return sig_figs
      if(value >= 1 and value < 10):
        return sig_figs + 1
      else:
        return sig_figs + 2
    sig_figs = check(value,sig_figs)
    decimal_places = sig_figs - int(math.floor(math.log10(abs(value)))) - 1
    rounded_value = round(value, decimal_places)
    
    return rounded_value

def SBTWA(Ka, Ma,Mb,Vi,V_added):
    V_total = V_added + Vi
    mol_A = Ma * Vi
    mol_B = Mb * V_added
    mol_A = round(mol_A, 10)
    mol_B = round(mol_B, 10)
    pKa = -math.log(Ka,10)
    Kb = math.pow(10,-14)/Ka
    if(mol_B == 0):
      extra = ' (No Volume Added)'
      ConcA = mol_A/V_total
      solution = math.sqrt(ConcA * Ka)
      pH = -math.log(solution,10)
      pH = round_to_sig_figs(pH,3)
      pH = str(pH)
      return pH + extra
    if(mol_A > mol_B):
        mol_conj = mol_B
        mol_A = mol_A - mol_B
        pH = pKa + math.log(mol_conj/mol_A,10)
        pH = round_to_sig_figs(pH, 3)
        pH = str(pH)
        if(mol_conj == mol_A):
            return pH + ' (Weak Acid Buffer Region)' + ' (Half Equivalence Point pKa = pH)'
        extra = ' (Weak Acid Buffer Region)'
        return pH + extra
    if(mol_A == mol_B):
        ConcB = mol_B/V_total
        solution = math.sqrt(ConcB * Kb)
        pH = 14 + math.log(solution,10)
        pH = round_to_sig_figs(pH, 3)
        extra = ' (Equivalence Point)'
        pH = str(pH)
        return pH + extra
    if(mol_B > mol_A):
        extra = ' (Excess Base)'
        mol_B = mol_B - mol_A
        ConcB = mol_B/V_total
        pH = 14 + math.log(ConcB,10)
        pH = round_to_sig_figs(pH, 3)
        return pH + extra
    
def SBTWAsig(Ka, Ma, Mb, Vi, V_added, sig):
    Ka = parse_to_float(Ka)
    Ma = parse_to_float(Ma)
    Mb = parse_to_float(Mb)
    Vi = parse_to_float(Vi)
    V_added = parse_to_float(V_added)
    sig = int(sig)
    
    print(f"Received values: Ka={Ka}, Ma={Ma}, Mb={Mb}, Vi={Vi}, V_added={V_added}, sig={sig}")

    if None in [Ka, Ma, Mb, Vi, V_added]:
        return "Invalid input: ensure all numerical values are valid."

    V_total = V_added + Vi
    mol_A = Ma * Vi
    mol_B = Mb * V_added
    mol_A = round(mol_A, 10)
    mol_B = round(mol_B, 10)
    pKa = -math.log(Ka, 10)
    Kb = math.pow(10, -14) / Ka

    if mol_B == 0:
        extra = ' (No Volume Added)'
        ConcA = mol_A / V_total
        solution = math.sqrt(ConcA * Ka)
        pH = -math.log(solution, 10)
        pH = round_to_sig_figs(pH, sig)
        pH = str(pH)
        return pH + extra

    if mol_A > mol_B:
        mol_conj = mol_B
        mol_A = mol_A - mol_B
        pH = pKa + math.log(mol_conj / mol_A, 10)
        pH = round_to_sig_figs(pH, sig)
        pH = str(pH)
        extra = ' (Weak Acid Buffer Region)'
        if mol_conj == mol_A:
            return pH + ' (Weak Acid Buffer Region)' + ' (Half Equivalence Point pKa = pH)'
        return pH + extra

    if mol_A == mol_B:
        ConcB = mol_B / V_total
        solution = math.sqrt(ConcB * Kb)
        pH = 14 + math.log(solution, 10)
        pH = round_to_sig_figs(pH, sig)
        extra = ' (Equivalence Point)'
        pH = str(pH)
        return pH + extra

    if mol_B > mol_A:
        extra = ' (Excess Base)'
        mol_B = mol_B - mol_A
        ConcB = mol_B / V_total
        pH = 14 + math.log(ConcB, 10)
        pH = round_to_sig_figs(pH, sig)
        return pH + extra
    
def SATWB(Kb, Mb,Ma,Vi,V_added):
    V_total = V_added + Vi
    mol_A = Ma * V_added
    mol_B = Mb * Vi
    mol_A = round(mol_A, 10)
    mol_B = round(mol_B, 10)
    pKb = -math.log(Kb,10)
    Ka = math.pow(10,-14)/Kb
    if(mol_A == 0):
      extra = ' (No Volume Added)'
      ConcB = mol_B/V_total
      solution = math.sqrt(ConcB * Kb)
      pH = 14 + math.log(solution,10)
      pH = round_to_sig_figs(pH,3)
      pH = str(pH)
      return pH + extra
    if(mol_B > mol_A):
        mol_conj = mol_A
        mol_B = mol_B - mol_A
        pOH = pKb + math.log(mol_conj/mol_B,10)
        pH = 14 - pOH
        pH = round_to_sig_figs(pH, 3)
        if(mol_conj == mol_B):
            return pH + ' (Weak Base Buffer Region)' + ' (Half Equivalence Point pKa = pH)'
        pH = str(pH)
        extra = ' (Weak Base Buffer Region)'
        return pH + extra
    if(mol_A == mol_B):
        ConcA = mol_A/V_total
        solution = math.sqrt(Ka * ConcA)
        pH = -math.log(solution,10)
        pH = round_to_sig_figs(pH, 3)
        extra = ' (Equivalence Point)'
        pH = str(pH)
        return pH + extra
    if(mol_A > mol_B):
        extra = ' (Excess Acid)'
        mol_A = mol_A - mol_B
        ConcA = mol_A/V_total
        pH = -math.log(ConcA,10)
        pH = round_to_sig_figs(pH, 3)
        pH = str(pH)
        return pH + extra
    
def SATWBsig(Kb, Mb,Ma,Vi,V_added,sig):
    Kb = parse_to_float(Kb)
    Ma = parse_to_float(Ma)
    Mb = parse_to_float(Mb)
    Vi = parse_to_float(Vi)
    V_added = parse_to_float(V_added)
    sig = int(sig)

    V_total = V_added + Vi
    mol_A = Ma * V_added
    mol_B = Mb * Vi
    mol_A = round(mol_A, 10)
    mol_B = round(mol_B, 10)
    pKb = -math.log(Kb,10)
    Ka = math.pow(10,-14)/Kb
    if(mol_A == 0):
      extra = ' (No Volume Added)'
      ConcB = mol_B/V_total
      solution = math.sqrt(ConcB * Kb)
      pH = 14 + math.log(solution,10)
      pH = round_to_sig_figs(pH,sig)
      pH = str(pH)
      return pH + extra
    if(mol_B > mol_A):
        mol_conj = mol_A
        mol_B = mol_B - mol_A
        pOH = pKb + math.log(mol_conj/mol_B,10)
        pH = 14 - pOH
        pH = round_to_sig_figs(pH, sig)
        pH = str(pH)
        if(mol_conj == mol_B):
            return pH + ' (Weak Base Buffer Region)' + ' (Half Equivalence Point pKa = pH)'
        extra = ' (Weak Base Buffer Region)'
        return pH + extra
    if(mol_A == mol_B):
        ConcA = mol_A/V_total
        solution = math.sqrt(Ka * ConcA)
        pH = -math.log(solution,10)
        pH = round_to_sig_figs(pH, sig)
        extra = ' (Equivalence Point)'
        pH = str(pH)
        return pH + extra
    if(mol_A > mol_B):
        extra = ' (Excess Acid)'
        mol_A = mol_A - mol_B
        ConcA = mol_A/V_total
        pH = -math.log(ConcA,10)
        pH = round_to_sig_figs(pH, sig)
        pH = str(pH)
        return pH + extra
    
def SATSB(Mb,Ma,Vi,V_added):
    mol_A = Ma * V_added
    mol_B = Mb * Vi
    mol_A = round(mol_A, 10)
    mol_B = round(mol_B, 10)
    V_total = Vi + V_added
    if(mol_A == 0):
      extra = ' (No Volume Added)'
      ConcB = mol_B/V_total
      pH = 14 + math.log(ConcB,10)
      pH = round_to_sig_figs(pH,3)
      pH = str(pH)
      return pH + extra
    if(mol_B > mol_A):
        Conc = (mol_B-mol_A)/V_total
        pH = 14 + math.log(Conc,10)
        pH = round_to_sig_figs(pH, 3)
        extra = ' (Excess Base)'
        pH = str(pH)
        return pH + extra
    if mol_A == mol_B:
        pH = 7.00
        extra = ' (Equivalence Point)'
        pH = str(pH)
        return pH + extra
    if mol_A > mol_B:
        Conc = (mol_A-mol_B)/V_total
        extra = ' (Excess Acid)'
        pH = -math.log(Conc,10)
        pH = round_to_sig_figs(pH, 3)
        pH = str(pH)
        return pH + extra
    
def SATSBsig(Mb,Ma,Vi,V_added,sig):
    
    Ma = parse_to_float(Ma)
    Mb = parse_to_float(Mb)
    Vi = parse_to_float(Vi)
    V_added = parse_to_float(V_added)
    sig = int(sig)

    mol_A = Ma * V_added
    mol_B = Mb * Vi
    V_total = Vi + V_added
    mol_A = round(mol_A, 10)
    mol_B = round(mol_B, 10)
    print(mol_A,mol_B)
    if(mol_A == 0):
      extra = ' (No Volume Added)'
      ConcB = mol_B/V_total
      pH = 14 + math.log(ConcB,10)
      pH = round_to_sig_figs(pH,sig)
      pH = str(pH)
      return pH + extra
    if(mol_B > mol_A):
        Conc = (mol_B-mol_A)/V_total
        pH = 14 + math.log(Conc,10)
        pH = round_to_sig_figs(pH, sig)
        extra = ' (Excess Base)'
        pH = str(pH)
        return pH + extra
    if mol_A == mol_B:
        pH = 7.00
        extra = ' (Equivalence Point)'
        pH = str(pH)
        return pH + extra
    if mol_A > mol_B:
        Conc = (mol_A-mol_B)/V_total
        extra = ' (Excess Acid)'
        pH = -math.log(Conc,10)
        pH = round_to_sig_figs(pH, sig)
        pH = str(pH)
        return pH + extra
    
def SBTSA(Ma,Mb,Vi,V_added):
    mol_A = Ma * Vi
    mol_B = Mb * V_added
    mol_A = round(mol_A, 10)
    mol_B = round(mol_B, 10)
    V_total = Vi + V_added
    if(mol_B == 0):
      extra = ' (No Volume Added)'
      ConcA = mol_A/V_total
      pH = -math.log(ConcA,10)
      pH = round_to_sig_figs(pH,3)
      pH = str(pH)
      return pH + extra
    if(mol_B > mol_A):
        Conc = (mol_B-mol_A)/V_total
        pH = 14 + math.log(Conc,10)
        pH = round_to_sig_figs(pH, 3)
        extra = ' (Excess Base)'
        pH = str(pH)
        return pH + extra
    if mol_A == mol_B:
        pH = 7.00
        extra = ' (Equivalence Point)'
        pH = str(pH)
        return pH + extra
    if mol_A < mol_B:
        Conc = (mol_A-mol_B)/V_total
        extra = ' (Excess Acid)'
        pH = -math.log(Conc,10)
        pH = round_to_sig_figs(pH, 3)
        pH = str(pH)
        return pH + extra
    
def SBTSAsig(Ma,Mb,Vi,V_added,sig):
    
    Ma = parse_to_float(Ma)
    Mb = parse_to_float(Mb)
    Vi = parse_to_float(Vi)
    V_added = parse_to_float(V_added)
    sig = int(sig)

    mol_A = Ma * Vi
    mol_B = Mb * V_added
    mol_A = round(mol_A, 10)
    mol_B = round(mol_B, 10)
    V_total = Vi + V_added
    if(mol_B == 0):
      extra = ' (No Volume Added)'
      ConcA = mol_A/V_total
      pH = -math.log(ConcA,10)
      pH = round_to_sig_figs(pH,sig)
      pH = str(pH)
      return pH + extra
    if(mol_B > mol_A):
        Conc = (mol_B-mol_A)/V_total
        pH = 14 + math.log(Conc,10)
        pH = round_to_sig_figs(pH, sig)
        extra = ' (Excess Base)'
        pH = str(pH)
        return pH + extra
    if mol_A == mol_B:
        pH = 7.00
        extra = ' (Equivalence Point)'
        pH = str(pH)
        return pH + extra
    if mol_A > mol_B:
        Conc = (mol_A-mol_B)/V_total
        extra = ' (Excess Acid)'
        pH = -math.log(Conc,10)
        pH = round_to_sig_figs(pH, sig)
        pH = str(pH)
        return pH + extra

@app.route('/calculate-ph-sbtwasig', methods=['POST'])
def calculate_ph_sbtwasig():
    data = request.json
    Ka = data.get('Ka')
    Ma = data.get('Ma')
    Mb = data.get('Mb')
    Vi = data.get('Vi')
    V_added = data.get('V_added')
    sig = data.get('sig')
    result = SBTWAsig(Ka, Ma, Mb, Vi, V_added, sig)
    print(f"Returning result: {result}")
    return jsonify({'result': result})

@app.route('/calculate-ph-satwbsig', methods=['POST'])
def calculate_ph_satwbsig():
    data = request.json
    Kb = data.get('Kb')
    Mb = data.get('Mb')
    Ma = data.get('Ma')
    Vi = data.get('Vi')
    V_added = data.get('V_added')
    sig = data.get('sig')
    result = SATWBsig(Kb, Mb, Ma, Vi, V_added, sig)
    print(f"Returning result: {result}")
    return jsonify({'result': result})

@app.route('/calculate-ph-satsbsig', methods=['POST'])
def calculate_ph_satsbsig():
    data = request.json
    
    Mb = data.get('Mb')
    Ma = data.get('Ma')
    Vi = data.get('Vi')
    V_added = data.get('V_added')
    sig = data.get('sig')
    result = SATSBsig(Mb, Ma, Vi, V_added, sig)
    print(f"Returning result: {result}")
    return jsonify({'result': result})

@app.route('/calculate-ph-sbtsasig', methods=['POST'])
def calculate_ph_sbtsasig():
    data = request.json
    
    Ma = data.get('Ma')
    Mb = data.get('Mb')
    Vi = data.get('Vi')
    V_added = data.get('V_added')
    sig = data.get('sig')
    result = SBTSAsig(Ma, Mb, Vi, V_added, sig)
    print(f"Returning result: {result}")
    return jsonify({'result': result})

#Titrations Molarity

def round_to_sig_figs_titration(value, sig_figs):
    """
    Rounds a number to the specified number of significant figures.
    """
    if value == 0:
        return 0

    # Calculate the number of decimal places required
    decimal_places = sig_figs - int(math.floor(math.log10(abs(value)))) - 1

    # Round the value to the specified number of decimal places
    rounded_value = round(value, decimal_places)

    # Format the value to ensure it has the correct number of significant figures
    

    return rounded_value

def unknownmolarity(given,initial,final):
    v_added = final - initial
    if(v_added > 0):
        unknown = given * initial/v_added
        unknown = round_to_sig_figs_titration(unknown, 3)
        unknown = str(unknown) + ' M'
        return unknown
    else:
        unknown = 'N/A - final volume is less than initial'

        return unknown
    
def unknownmolaritysig(given,initial,final,sigfig):
    given = parse_to_float(given)
    initial = parse_to_float(initial)
    final = parse_to_float(final)
    sigfig = int(sigfig)
    v_added = final - initial
    if(v_added > 0):
        unknown = given * initial/v_added
        unknown = round_to_sig_figs_titration(unknown, sigfig)
        unknown = str(unknown) + ' M'
        return unknown
    else:
        unknown = 'N/A - final volume is less than initial'
        return unknown

@app.route('/calculate-molarity', methods=['POST'])
def calculate_missing_molarity():
    data = request.json
    
    given = data.get('given')
    initial = data.get('initial')
    final = data.get('final')
    sigfig = data.get('sigfig')
    print(sigfig)
    
    result = unknownmolaritysig(given, initial, final, sigfig)
    print(f"Returning result: {result}")
    return jsonify({'result': result})

#Melting pt sorting

# Function to determine if the molecule is an element or a compound
def is_element(molecule):
    return sum(1 for c in molecule if c.isupper()) == 1

# Function to extract the numeric part from a string
def extract_numeric(value):
    import re
    numeric_part = re.findall(r"[-+]?\d*\.\d+|\d+", str(value))
    return float(numeric_part[0]) if numeric_part else None

# Function to read melting point from CSV files
def get_melting_point(molecule, elements_df, compounds_df):
    if is_element(molecule):
        row = elements_df.loc[elements_df['Symbol'] == molecule]
        if not row.empty:
            melting_point_k = row['Melting Point (K)'].values[0]
            if melting_point_k:
                melting_point_c = extract_numeric(melting_point_k) - 273.15
                return round(melting_point_c, 2) if melting_point_c is not None else None
    else:
        row = compounds_df.loc[compounds_df['Formula'] == molecule]
        if not row.empty:
            melting_point_c = row['Melting point (°C)'].values[0]
            if melting_point_c:
                melting_point_c = extract_numeric(melting_point_c)
                return round(melting_point_c, 2) if melting_point_c is not None else None
    return None

def loading(molecules):

    # Load data from CSV files, ignoring extra columns
    elements_df = read_csv('./public/MeltingPoints_elements.csv')
    compounds_df = read_csv('./public/MeltingPoints_compounds.csv', usecols=[1, 2])

    # Get user input
    molecules = molecules.split(',')

    # Remove any leading/trailing spaces from each molecule
    molecules = [molecule.strip() for molecule in molecules]

    # Create a list of tuples (molecule, melting_point)
    melting_points = [(molecule, get_melting_point(molecule, elements_df, compounds_df)) for molecule in molecules]

    # Handle molecules with no melting point found
    for molecule, melting_point in melting_points:
        if melting_point is None:
            print(f"Melting point for {molecule} not found.")

    # Remove molecules with no melting point found
    melting_points = [mp for mp in melting_points if mp[1] is not None]

    # Sort the list by melting point in ascending order
    sorted_melting_points = sorted(melting_points, key=lambda x: x[1])
    finalstr = ""
    # Display the sorted list
    
    for molecule, melting_point in sorted_melting_points:
        finalstr += f"{molecule}: {melting_point}°C, "

    return finalstr[0:len(finalstr)-2]

@app.route('/sort-melting', methods=['POST'])
def sort_melting():
    data = request.json
    
    molecules = data.get('molecules')
    print(molecules)
    
    result = loading(molecules)
    print(f"Returning result: {result}")
    return jsonify({'result': result})

#Solubility sorting

def get_solubility(compound, solubility_df):
    row = solubility_df.loc[solubility_df['Compound'] == compound]
    if not row.empty:
        solubility = row[' 25°C'].values[0]
        return extract_numeric(solubility)
    return None

def solubilityProcessing(compounds):
    solubility_df = read_csv('./public/Solubility.csv')

    # Get user input
    compounds = compounds.split(',')

    # Remove any leading/trailing spaces from each compound
    compounds = [compound.strip() for compound in compounds]

    # Create a list of tuples (compound, solubility)
    solubilities = [(compound, get_solubility(compound, solubility_df)) for compound in compounds]

    # Handle compounds with no solubility found
    for compound, solubility in solubilities:
        if solubility is None:
            print(f"Solubility for {compound} not found.")

    # Remove compounds with no solubility found
    solubilities = [s for s in solubilities if s[1] is not None]

    # Sort the list by solubility in ascending order
    sorted_solubilities = sorted(solubilities, key=lambda x: x[1])

    # Display the sorted list
    finalstr = ""
    for compound, solubility in sorted_solubilities:
        finalstr += f"{compound}: {solubility} g/100 mL, "

    return finalstr[0:len(finalstr)-2]

@app.route('/sort-solubility', methods=['POST'])
def sort_solubility():
    data = request.json
    
    compounds = data.get('compounds')
    
    
    result = solubilityProcessing(compounds)
    print(f"Returning result: {result}")
    return jsonify({'result': result})

#Balancing

def balancing(equation):
  def compiling(comp):
    def parse_compound(compound):
        # Regular expression to match elements and their optional counts
        element_pattern = re.compile(r'([A-Z][a-z]*)(\d*)')

        # Dictionary to hold element counts
        element_counts = defaultdict(int)

        # Find all matches in the compound
        for element, count in element_pattern.findall(compound):
            count = int(count) if count else 1  # Default count is 1 if not specified
            element_counts[element] += count

        return element_counts

    def expand_subformula(subformula, multiplier):
        """Expands a subformula with a given multiplier."""
        expanded_counts = defaultdict(int)
        sub_counts = parse_compound(subformula)
        for element, count in sub_counts.items():
            expanded_counts[element] += count * multiplier
        return expanded_counts

    def molecular_formula(compound):
        # Stack to manage nested formulas and their multipliers
        stack = []
        current_formula = defaultdict(int)
        i = 0
        while i < len(compound):
            if compound[i] == '(':
                # Start of a subformula, push the current formula onto the stack
                stack.append(current_formula)
                current_formula = defaultdict(int)
                i += 1
            elif compound[i] == ')':
                # End of a subformula, get the multiplier
                i += 1
                multiplier = 0
                while i < len(compound) and compound[i].isdigit():
                    multiplier = multiplier * 10 + int(compound[i])
                    i += 1
                multiplier = multiplier if multiplier > 0 else 1
                subformula_counts = current_formula
                current_formula = stack.pop()
                for element, count in subformula_counts.items():
                    current_formula[element] += count * multiplier
            else:
                # Parse the element and its count
                element_match = re.match(r'([A-Z][a-z]*)(\d*)', compound[i:])
                element = element_match.group(1)
                count = element_match.group(2)
                count = int(count) if count else 1
                current_formula[element] += count
                i += len(element) + (len(str(count)) if count > 1 else 0)

        # Create the molecular formula string in a consistent order (sorted by element name)
        formula = ''.join(f"{element}{current_formula[element] if current_formula[element] > 1 else ''}"
                          for element in sorted(current_formula.keys()))

        return formula
    def ion(compound):
      if("^" in compound):
        index = compound.index('^')
        ans = compound[index:]
        return ans
      return ""
    def newcompound(compound):
      if("^" in compound):
        index = compound.index('^')
        return compound[:index]
      return compound
    # Example usage
    charge = ion(comp)
    oldcompound = comp[:]
    comp = newcompound(comp)
    formula = molecular_formula(comp) + charge
    return formula

  def parse_compound(compound):
      """Parse a chemical compound into its elements and their counts."""
      elements = re.findall(r'([A-Z][a-z]*)(\d*)', compound)
      parsed = {element: int(count) if count else 1 for element, count in elements}
      return parsed

  def get_elements(compounds):
      """Get a set of all elements present in a list of compounds."""
      elements = set()
      for compound in compounds:
          elements.update(parse_compound(compound).keys())
      #print(elements)
      return elements
  def fixing(compounds):
    answer = []
    for compound in compounds:
      thingie = compiling(compound)
      answer.append(thingie)
    return answer
  def construct_matrix(equation):
      """Construct the matrix of coefficients for the linear system."""
      reactants, products = equation.split(' -> ')
      reactants = reactants.split(' + ')
      products = products.split(' + ')
      reactants = fixing(reactants)
      products = fixing(products)
      elements = list(get_elements(reactants + products))
      matrix = []

      for element in elements:
          row = []
          for compound in reactants:
              row.append(parse_compound(compound).get(element, 0))
          for compound in products:
              row.append(-parse_compound(compound).get(element, 0))
          matrix.append(row)

      return np.array(matrix, dtype=float)

  def find_lcm(arr):
      """Find the least common multiple of an array of integers."""
      lcm = 1
      for num in arr:
          lcm = np.lcm(lcm, num)
      return lcm

  def balance_equation(equation,hasion):
      """Balance a chemical equation."""
      matrix = construct_matrix(equation)
      num_reactants = len(equation.split(' -> ')[0].split(' + '))
      reactants, products = equation.split(' -> ')
      reactants = reactants.split(' + ')
      products = products.split(' + ')
      # Add an extra row for the equation x1 + x2 + ... = 1 to avoid the trivial solution
      matrix = getmatrix(reactants,products,hasion,matrix)
      matrix = np.vstack([matrix, np.ones(matrix.shape[1])])

      # Solve the system using numpy's lstsq (least squares)

      b = np.zeros(matrix.shape[0])
      b[-1] = 1
      bounds = (0,np.inf)
      #solution, residuals, rank, s = lstsq(matrix, b, rcond=None)
      solution = lsq_linear(matrix,b,bounds= bounds)
      # Convert coefficients to fractions and find the least common multiple of their denominators
      solution = solution.x
      fractions = [Fraction(s).limit_denominator() for s in solution]
      denominators = [f.denominator for f in fractions]
      lcm = find_lcm(denominators)

      coefficients = [int(f * lcm) for f in fractions]


      balanced_reaction = ' + '.join(f'{coefficients[i]}{compound}' if coefficients[i] != 1 else compound for i, compound in enumerate(reactants))
      balanced_reaction += ' -> '
      balanced_reaction += ' + '.join(f'{coefficients[i+num_reactants]}{compound}' if coefficients[i+num_reactants] != 1 else compound for i, compound in enumerate(products))

      return balanced_reaction
  def compute(charge,reactant):
    num = int(charge)
    if '-' in reactant:
      num *= -1
      return num
    return num
  def extract_charges(reactants):
    #Parameter should be reactants or products but I'm too lazy to fix lol ~ Cosmo
      charges = []
      for reactant in reactants:

          # Find the charge using regex to match pattern like "+", "2-", etc.
          match = re.search(r'\^([+-]?\d+|[+-])', reactant)
          #print(reactant)
          if match:
              charge_str = match.group(1)
              # Handle cases for '+', '-', '2+', '2-', etc.
              if charge_str in ['+', '-']:
                  charge = 1 if charge_str == '+' else -1
              else:
                  charge = compute(charge_str,reactant)
          else:
              charge = 0  # Default charge to 0 if no charge is found
          charges.append(charge)
      return charges
  def getmatrix(reactants,products,hasion,matrix):
    if hasion == False:
        # The last row corresponds to the normalization equation
      return matrix
    else:
      chargeR = extract_charges(reactants)
      chargeP = extract_charges(products)
      negated_chargeP = [-x for x in chargeP]
      arrayR = np.array(chargeR)
      arrayP = np.array(negated_chargeP)
      b = np.concatenate((arrayR,arrayP))
      matrix = np.vstack([matrix,b])
      return matrix
  def checkion(equation):
    if '^' in equation:
      return True
    return False
  hasion = checkion(equation)
  balanced_equation = balance_equation(equation,hasion)
  return balanced_equation

df = read_csv("./public/thermolist.csv")
sub = df['Substance'].tolist()
def remove_states(reaction):
    # This regular expression matches the state notation (e.g., (g), (l), (s), (aq))
    state_pattern = re.compile(r'\([a-z]+\)')

    # Replace state notation with an empty string
    cleaned_reaction = state_pattern.sub('', reaction)

    # Remove any extra spaces that might result from the removal
    cleaned_reaction = re.sub(r'\s+', ' ', cleaned_reaction).strip()

    return cleaned_reaction
def parse_reaction(reaction):
    # Split the reaction into reactants and products
    reactants_side, products_side = reaction.split(' -> ')

    # Split reactants and products into individual compounds
    reactants = reactants_side.split(' + ')
    products = products_side.split(' + ')

    # Initialize an empty dictionary to store compound states
    Rcompound_states = {}
    Pcompound_states = {}
    # Function to determine the state of each compound
    def determine_state(compound):
        if '(s)' in compound:
            return '(s)'
        elif '(l)' in compound:
            return '(l)'
        elif '(g)' in compound:
            return '(g)'
        elif '(aq)' in compound:
            return '(aq)'
        elif '(s, graphite)' in compound:
           return '(s, graphite)'
        elif '(s, diamond)' in compound:
           return '(s, diamond)'
        else:
            return '(N)'

    # Parse reactants
    for compound in reactants:
        state = determine_state(compound)
        if state != '(N)':
          compound_name = compound.split(state)[0].strip()  # Extract compound name
          Rcompound_states[compound_name] = state
        else:
          Rcompound_states[compound] = state



    # Parse products
    for compound in products:
        state = determine_state(compound)
        if state != '(N)':
          compound_name = compound.split(state)[0].strip()  # Extract compound name
          Pcompound_states[compound_name] = state
        else:
          Pcompound_states[compound] = state
    return Rcompound_states,Pcompound_states
def add_states_to_reaction(reaction, Rstates_dict,Pstates_dict):
    # Split the reaction into reactants and products
    reactants, products = reaction.split(" -> ")

    # Split reactants and products into individual compounds
    reactants = reactants.split(" + ")
    products = products.split(" + ")

    # Function to add states to a list of compounds
    def addcharge(formula,compound):
      if '^' in compound:
        index = compound.index('^')
        charge = compound[index:]
        formula = formula + charge
        return formula
      return formula
    def add_states(compounds,states_dict):
        result = []
        for compound in compounds:
            # Match coefficient and formula using regular expression
            match = re.match(r"(\d*)([A-Za-z0-9]+)", compound)
            if match:
                coefficient = match.group(1)
                length = len(coefficient)
                formula = compound[length:]
                if coefficient:
                    compound_with_state = f"{coefficient}{formula}{states_dict.get(formula,'')}"
                else:
                    compound_with_state = f"{formula}{states_dict.get(formula,'')}"
                result.append(compound_with_state)
        return result

    # Add states to reactants and products
    reactants_with_states = add_states(reactants,Rstates_dict)
    products_with_states = add_states(products,Pstates_dict)
    # Join the lists back into strings
    reactants_str = " + ".join(reactants_with_states)
    products_str = " + ".join(products_with_states)

    # Construct the final reaction string
    final_reaction = f"{reactants_str} -> {products_str}"

    return final_reaction
def finding(check):
  for substance in sub:

    if(check in substance):
      if(substance.index(check) == 0):
        answer = substance[-3:]
        if(substance[-3] == '('):
          answer = substance[-3:]
          return answer
        elif substance[-4] == '(':
          answer = substance[-4:]
          return answer
        elif 'diamond' in check:
          return '(s, diamond)'
        elif 'graphite' in check:
          return '(s, graphite)'
  return '(N)'
def classify(compound_states):
  for compound,state in compound_states.items():
    if(state == "(N)"):
      state = finding(compound)
      compound_states[compound] = state
  return compound_states
# Example reaction
def transform_ion_charges(reaction):
    # Replace "1+" with "+"
    reaction = re.sub(r'\^1\+', '^+', reaction)
    # Replace "1-" with "-"
    reaction = re.sub(r'\^1-', '^-', reaction)
    return reaction
def remove_coefficients(reaction):
    # Split the reaction into reactants and products
    reactants, products = reaction.split('->')
    reactants = reactants.split(' + ')
    products = products.split(' + ')

    # Helper function to remove coefficients
    def remove_coeff(compound_list):
        compound_no_coeff = []
        for compound in compound_list:
            # Remove whitespace
            compound = compound.strip()
            # Remove the coefficient (if any)
            compound_no_coeff.append(re.sub(r'^\d+', '', compound).strip())
        return compound_no_coeff

    # Remove coefficients from reactants and products
    reactants_no_coeff = remove_coeff(reactants)
    products_no_coeff = remove_coeff(products)

    # Join reactants and products back into strings
    reactants_no_coeff_str = ' + '.join(reactants_no_coeff)
    products_no_coeff_str = ' + '.join(products_no_coeff)

    # Form the new reaction
    new_reaction = reactants_no_coeff_str + ' -> ' + products_no_coeff_str
    return new_reaction

def Full_balance(reaction):
  reaction = remove_coefficients(reaction)
  reaction = transform_ion_charges(reaction)
  Rcompound_states,Pcompound_states = parse_reaction(reaction)
  cleaned_reaction = remove_states(reaction)
  Rcompound_states = classify(Rcompound_states)
  Pcompound_states = classify(Pcompound_states)
  balanced_reaction = balancing(cleaned_reaction)
  new_reaction = add_states_to_reaction(balanced_reaction, Rcompound_states,Pcompound_states)
  return new_reaction

@app.route('/balance-equation', methods=['POST'])
def balance_equation():
    data = request.json
    reaction = data.get('reaction')
    try:
        logging.debug(f"Received reaction: {reaction}")
        result = Full_balance(reaction)
        logging.debug(f"Balanced reaction: {result}")
        return jsonify({'result': result})
    except Exception as e:
        logging.error(f"Error balancing equation: {e}")
        return jsonify({'error': str(e)}), 500

#Base redox reaction

def base_split_redox_reaction(equation):
    def parse_compound_basic(compound):
        element_pattern = re.compile(r'([A-Z][a-z]*)(\d*)')
        coefficient_pattern = re.compile(r'(\d+)([A-Za-z][a-z]*)')
        element_counts = defaultdict(int)
        coefficient_match = coefficient_pattern.match(compound)
        if coefficient_match:
            coefficient = int(coefficient_match.group(1))
            compound = coefficient_match.group(2)
        else:
            coefficient = 1
        for element, count in element_pattern.findall(compound):
            count = int(count) if count else 1
            element_counts[element] += count * coefficient
        return element_counts

    def remove_oxygen_hydrogen(element_counts):
        element_counts.pop('O', None)
        element_counts.pop('H', None)
        return element_counts

    def balance_half_reaction(half_reaction):
        reactant, product = half_reaction.split(' -> ')
        reactant_elements = parse_compound_basic(reactant)
        product_elements = parse_compound_basic(product)
        reactant_elements2 = reactant_elements.copy()
        product_elements2 = product_elements.copy()

        # Remove oxygen and hydrogen
        reactant_elements = remove_oxygen_hydrogen(reactant_elements)
        product_elements = remove_oxygen_hydrogen(product_elements)

        # Find the maximum count of each element
        max_counts = {}
        for element, count in reactant_elements.items():
            max_counts[element] = max(count, product_elements2.get(element, 0))
        for element, count in product_elements.items():
            max_counts[element] = max(count, reactant_elements2.get(element, 0))

        # Balance the half reaction
        balanced_reactant = ''
        balanced_product = ''
        for i, (element, max_count) in enumerate(max_counts.items()):
            reactant_coefficient = max_count // reactant_elements.get(element, 1)
            product_coefficient = max_count // product_elements.get(element, 1)
            if reactant_coefficient > 1:
                balanced_reactant += f"{reactant_coefficient}{reactant}"
            else:
                balanced_reactant += reactant
            if product_coefficient > 1:
                balanced_product += f"{product_coefficient}{product}"
            else:
                balanced_product += product
            if i != len(max_counts) - 1:
                balanced_reactant += ' '
                balanced_product += ' '

        # Balance Oxygens
        reactant_oxygens = reactant_elements2.get('O', 0)
        product_oxygens = product_elements2.get('O', 0)
        oxygen_diff = reactant_oxygens - product_oxygens
        if oxygen_diff > 0:
            balanced_product += f" + {oxygen_diff}H2O"
        elif oxygen_diff < 0:
            balanced_reactant += f" + {-oxygen_diff}H2O"

        # Parse the compounds again after adding H2O
        reactant_elements2 = parse_compound_basic(balanced_reactant.split(' + ')[0])
        product_elements2 = parse_compound_basic(balanced_product.split(' + ')[0])

        # Balance Hydrogens
        reactant_hydrogens = reactant_elements2.get('H', 0)
        product_hydrogens = product_elements2.get('H', 0)
        hydrogen_diff = (reactant_hydrogens - product_hydrogens) - oxygen_diff * 2
        if hydrogen_diff > 0:
            balanced_product += f" + {hydrogen_diff}H^1+"
        elif hydrogen_diff < 0:
            balanced_reactant += f" + {-hydrogen_diff}H^1+"

        return f"{balanced_reactant} -> {balanced_product}"

    def parse_charge(compound):
        coefficient_pattern = re.compile(r'(\d*)')
        charge_pattern = re.compile(r'\^(\d*[+-])')
        coefficient_match = coefficient_pattern.match(compound)
        if coefficient_match:
            coefficient = int(coefficient_match.group(1)) if coefficient_match.group(1) else 1
        else:
            coefficient = 1
        charge_match = charge_pattern.search(compound)
        if charge_match:
            charge_str = charge_match.group(1)
            if charge_str in ['+', '-']:
                charge = 1 if charge_str == '+' else -1
            else:
                if '+' in charge_str:
                    charge = int(charge_str.replace('+', ''))
                else:
                    charge = -int(charge_str.replace('-', ''))
            charge *= coefficient
        else:
            charge = 0
        return charge

    def balance_charges(half_reaction):
        reactant, product = half_reaction.split(' -> ')
        reactant_compounds = reactant.split(' + ')
        product_compounds = product.split(' + ')

        total_reactant_charge = sum(parse_charge(compound) for compound in reactant_compounds)
        total_product_charge = sum(parse_charge(compound) for compound in product_compounds)

        charge_diff = total_reactant_charge - total_product_charge

        if charge_diff > 0:
            reactant += f" + {charge_diff}e^-1"
        elif charge_diff < 0:
            product += f" + {-charge_diff}e^-1"

        return f"{reactant} -> {product}"

    def lcm(a, b):
        return abs(a*b) // gcd(a, b)

    def find_lcm(nums):
        return reduce(lcm, nums)

    def adjust_coefficients_for_lcm(half_reactions):
        e_coeffs = []
        for half_reaction in half_reactions:
            reactant, product = half_reaction.split(' -> ')
            e_coeff = 0
            for part in reactant.split(' + ') + product.split(' + '):
                if 'e^-1' in part:
                    e_coeff = int(re.findall(r'(\d+)e\^-1', part)[0])
                    e_coeffs.append(e_coeff)
                    break

        if not e_coeffs:
            return half_reactions

        lcm_e = find_lcm(e_coeffs)

        adjusted_half_reactions = []
        for half_reaction in half_reactions:
            reactant, product = half_reaction.split(' -> ')
            e_coeff = 0
            for part in reactant.split(' + ') + product.split(' + '):
                if 'e^-1' in part:
                    e_coeff = int(re.findall(r'(\d+)e\^-1', part)[0])
                    break

            factor = lcm_e // e_coeff

            def adjust_coefficients(side):
                adjusted_side = []
                for compound in side.split(' + '):
                    match = re.match(r'(\d+)(.*)', compound)
                    if match:
                        new_coeff = int(match.group(1)) * factor
                        adjusted_side.append(f"{new_coeff}{match.group(2)}")
                    else:
                        adjusted_side.append(f"{factor}{compound}")
                return ' + '.join(adjusted_side)

            adjusted_reactant = adjust_coefficients(reactant)
            adjusted_product = adjust_coefficients(product)

            adjusted_half_reactions.append(f"{adjusted_reactant} -> {adjusted_product}")

        return adjusted_half_reactions

    def combine_half_reactions(half_reactions):
        combined_reactants = defaultdict(int)
        combined_products = defaultdict(int)

        for half_reaction in half_reactions:
            reactant, product = half_reaction.split(' -> ')
            for part in reactant.split(' + '):
                match = re.match(r'(\d+)?(.*)', part)
                if match:
                    count = int(match.group(1)) if match.group(1) else 1
                    compound = match.group(2)
                    combined_reactants[compound] += count
            for part in product.split(' + '):
                match = re.match(r'(\d+)?(.*)', part)
                if match:
                    count = int(match.group(1)) if match.group(1) else 1
                    compound = match.group(2)
                    combined_products[compound] += count

        # Simplify the combined reactants and products
        for compound in list(combined_reactants.keys()):
            if compound in combined_products:
                reactant_count = combined_reactants[compound]
                product_count = combined_products[compound]
                if reactant_count == product_count:
                    del combined_reactants[compound]
                    del combined_products[compound]
                elif reactant_count > product_count:
                    combined_reactants[compound] -= product_count
                    del combined_products[compound]
                else:
                    combined_products[compound] -= reactant_count
                    del combined_reactants[compound]

        combined_reactant_str = ' + '.join(f"{count}{compound}" if count > 1 else compound for compound, count in combined_reactants.items())
        combined_product_str = ' + '.join(f"{count}{compound}" if count > 1 else compound for compound, count in combined_products.items())

        return f"{combined_reactant_str} -> {combined_product_str}"

    def balance_acid_base(combined_reaction):
        reactant, product = combined_reaction.split(' -> ')
        reactants = reactant.split(' + ')
        products = product.split(' + ')

        reactant_counts = defaultdict(int)
        product_counts = defaultdict(int)

        for part in reactants:
            match = re.match(r'(\d+)?(.*)', part)
            if match:
                count = int(match.group(1)) if match.group(1) else 1
                compound = match.group(2)
                reactant_counts[compound] += count

        for part in products:
            match = re.match(r'(\d+)?(.*)', part)
            if match:
                count = int(match.group(1)) if match.group(1) else 1
                compound = match.group(2)
                product_counts[compound] += count

        if 'H^1+' in reactant_counts:
            h_plus_count = reactant_counts['H^1+']
            product_counts['OH^1-'] += h_plus_count
            reactant_counts['H2O'] += h_plus_count
            del reactant_counts['H^1+']
        elif 'H^1+' in product_counts:
            h_plus_count = product_counts['H^1+']
            reactant_counts['OH^1-'] += h_plus_count
            product_counts['H2O'] += h_plus_count
            del product_counts['H^1+']

        # Simplify H2O on both sides
        if 'H2O' in reactant_counts and 'H2O' in product_counts:
            reactant_h2o_count = reactant_counts['H2O']
            product_h2o_count = product_counts['H2O']
            if reactant_h2o_count > product_h2o_count:
                reactant_counts['H2O'] -= product_h2o_count
                del product_counts['H2O']
            elif product_h2o_count > reactant_h2o_count:
                product_counts['H2O'] -= reactant_h2o_count
                del reactant_counts['H2O']
            else:
                del reactant_counts['H2O']
                del product_counts['H2O']

        final_reactant_str = ' + '.join(f"{count}{compound}" if count > 1 else compound for compound, count in reactant_counts.items())
        final_product_str = ' + '.join(f"{count}{compound}" if count > 1 else compound for compound, count in product_counts.items())

        return f"{final_reactant_str} -> {final_product_str}"

    reactants, products = equation.split(' -> ')
    reactants = reactants.split(' + ')
    products = products.split(' + ')

    reactant_elements = [remove_oxygen_hydrogen(parse_compound_basic(reactant)) for reactant in reactants]
    product_elements = [remove_oxygen_hydrogen(parse_compound_basic(product)) for product in products]

    pairs = []
    for i in range(len(reactants)):
        for j in range(len(products)):
            if set(reactant_elements[i].keys()).intersection(set(product_elements[j].keys())):
                pairs.append((i, j))

    half_reactions = []
    for pair in pairs:
        half_reaction = f"{reactants[pair[0]]} -> {products[pair[1]]}"
        balanced_half_reaction = balance_half_reaction(half_reaction)
        balanced_half_reaction_with_charges = balance_charges(balanced_half_reaction)
        half_reactions.append(balanced_half_reaction_with_charges)
    adjusted_half_reactions = adjust_coefficients_for_lcm(half_reactions)
    combined_reaction = combine_half_reactions(adjusted_half_reactions)
    final_reaction = balance_acid_base(combined_reaction)
    def move_electron(reaction):
      left, right = reaction.split(' -> ')
        # Regex to identify electron terms in the form e^-1
      electron_pattern = r'(\d*e\^-\d+|\d*e\^-\d*|\d*e\^-\d*|\de\^-\d*|e\^-\d*)'

      # Find and remove electron term from the left side
      left_electron_term = re.search(electron_pattern, left)
      if left_electron_term:
          electron = left_electron_term.group()
          left = left.replace(electron, '').strip(' +')
          right = right + ' + ' + electron
      else:
          # Find and remove electron term from the right side
          right_electron_term = re.search(electron_pattern, right)
          if right_electron_term:
              electron = right_electron_term.group()
              right = right.replace(electron, '').strip(' +')
              left = left + ' + ' + electron

      # Clean up multiple plus signs and spaces
      left = re.sub(r'\s*\+\s*$', '', left).strip()
      right = re.sub(r'\s*\+\s*$', '', right).strip()
      left = re.sub(r'\s*\+\s*\+', ' + ', left)
      right = re.sub(r'\s*\+\s*\+', ' + ', right)

      # Combine the left and right sides back into a single string
      new_equation = f"{left} -> {right}"

      return new_equation
    #half_reactions[0] = move_electron(half_reactions[0])
    #half_reactions[1] = move_electron(half_reactions[1])
    try:
        return half_reactions[0],half_reactions[1],final_reaction
    except:
        return "none", "none", "none"

#Acid redox reaction

def acid_split_redox_reaction(equation):

  def parse_compound_acid(compound):
      element_pattern = re.compile(r'([A-Z][a-z]*)(\d*)')
      coefficient_pattern = re.compile(r'(\d+)([A-Za-z][a-z]*)')
      element_counts = defaultdict(int)
      coefficient_match = coefficient_pattern.match(compound)
      if coefficient_match:
          coefficient = int(coefficient_match.group(1))
          compound = coefficient_match.group(2)
      else:
          coefficient = 1
      for element, count in element_pattern.findall(compound):
          count = int(count) if count else 1
          element_counts[element] += count * coefficient
      return element_counts

  def remove_oxygen_hydrogen(element_counts):
      element_counts.pop('O', None)
      element_counts.pop('H', None)
      return element_counts

  def balance_half_reaction(half_reaction):
      reactant, product = half_reaction.split(' -> ')
      reactant_elements = parse_compound_acid(reactant)
      product_elements = parse_compound_acid(product)
      reactant_elements2 = reactant_elements.copy()
      product_elements2 = product_elements.copy()

      # Remove oxygen and hydrogen
      reactant_elements = remove_oxygen_hydrogen(reactant_elements)
      product_elements = remove_oxygen_hydrogen(product_elements)

      # Find the maximum count of each element
      max_counts = {}
      for element, count in reactant_elements.items():
          max_counts[element] = max(count, product_elements2.get(element, 0))
      for element, count in product_elements.items():
          max_counts[element] = max(count, reactant_elements2.get(element, 0))

      # Balance the half reaction
      balanced_reactant = ''
      balanced_product = ''
      for i, (element, max_count) in enumerate(max_counts.items()):
          reactant_coefficient = max_count // reactant_elements.get(element, 1)
          product_coefficient = max_count // product_elements.get(element, 1)
          if reactant_coefficient > 1:
              balanced_reactant += f"{reactant_coefficient}{reactant}"
          else:
              balanced_reactant += reactant
          if product_coefficient > 1:
              balanced_product += f"{product_coefficient}{product}"
          else:
              balanced_product += product
          if i != len(max_counts) - 1:
              balanced_reactant += ' '
              balanced_product += ' '

      # Balance Oxygens
      reactant_oxygens = reactant_elements2.get('O', 0)
      product_oxygens = product_elements2.get('O', 0)
      oxygen_diff = reactant_oxygens - product_oxygens
      if oxygen_diff > 0:
          balanced_product += f" + {oxygen_diff}H2O"
      elif oxygen_diff < 0:
          balanced_reactant += f" + {-oxygen_diff}H2O"

      # Parse the compounds again after adding H2O
      reactant_elements2 = parse_compound_acid(balanced_reactant.split(' + ')[0])
      product_elements2 = parse_compound_acid(balanced_product.split(' + ')[0])

      # Balance Hydrogens
      reactant_hydrogens = reactant_elements2.get('H', 0)
      product_hydrogens = product_elements2.get('H', 0)
      hydrogen_diff = (reactant_hydrogens - product_hydrogens) - oxygen_diff * 2
      if hydrogen_diff > 0:
          balanced_product += f" + {hydrogen_diff}H^1+"
      elif hydrogen_diff < 0:
          balanced_reactant += f" + {-hydrogen_diff}H^1+"


      return f"{balanced_reactant} -> {balanced_product}"

  def parse_charge(compound):
      coefficient_pattern = re.compile(r'(\d*)')
      charge_pattern = re.compile(r'\^(\d*[+-])')
      coefficient_match = coefficient_pattern.match(compound)
      if coefficient_match:
          coefficient = int(coefficient_match.group(1)) if coefficient_match.group(1) else 1
      else:
          coefficient = 1
      charge_match = charge_pattern.search(compound)
      if charge_match:
          charge_str = charge_match.group(1)
          if charge_str in ['+', '-']:
              charge = 1 if charge_str == '+' else -1
          else:
              if '+' in charge_str:
                  charge = int(charge_str.replace('+', ''))
              else:
                  charge = -int(charge_str.replace('-', ''))
          charge *= coefficient
      else:
          charge = 0
      return charge


  def balance_charges(half_reaction):
      reactant, product = half_reaction.split(' -> ')
      reactant_compounds = reactant.split(' + ')
      product_compounds = product.split(' + ')

      total_reactant_charge = sum(parse_charge(compound) for compound in reactant_compounds)
      total_product_charge = sum(parse_charge(compound) for compound in product_compounds)

      charge_diff = total_reactant_charge - total_product_charge

      if charge_diff > 0:
          reactant += f" + {charge_diff}e^-1"
      elif charge_diff < 0:
          product += f" + {-charge_diff}e^-1"

      return f"{reactant} -> {product}"

  def lcm(a, b):
      return abs(a*b) // gcd(a, b)

  def find_lcm(nums):
      return reduce(lcm, nums)

  def adjust_coefficients_for_lcm(half_reactions):
      e_coeffs = []
      for half_reaction in half_reactions:
          reactant, product = half_reaction.split(' -> ')
          e_coeff = 0
          for part in reactant.split(' + ') + product.split(' + '):
              if 'e^-1' in part:
                  e_coeff = int(re.findall(r'(\d+)e\^-1', part)[0])
                  e_coeffs.append(e_coeff)
                  break

      if not e_coeffs:
          return half_reactions

      lcm_e = find_lcm(e_coeffs)

      adjusted_half_reactions = []
      for half_reaction in half_reactions:
          reactant, product = half_reaction.split(' -> ')
          e_coeff = 0
          for part in reactant.split(' + ') + product.split(' + '):
              if 'e^-1' in part:
                  e_coeff = int(re.findall(r'(\d+)e\^-1', part)[0])
                  break

          factor = lcm_e // e_coeff

          def adjust_coefficients(side):
              adjusted_side = []
              for compound in side.split(' + '):
                  match = re.match(r'(\d+)(.*)', compound)
                  if match:
                      new_coeff = int(match.group(1)) * factor
                      adjusted_side.append(f"{new_coeff}{match.group(2)}")
                  else:
                      adjusted_side.append(f"{factor}{compound}")
              return ' + '.join(adjusted_side)

          adjusted_reactant = adjust_coefficients(reactant)
          adjusted_product = adjust_coefficients(product)

          adjusted_half_reactions.append(f"{adjusted_reactant} -> {adjusted_product}")

      return adjusted_half_reactions

  def combine_half_reactions(half_reactions):
      combined_reactants = defaultdict(int)
      combined_products = defaultdict(int)

      for half_reaction in half_reactions:
          reactant, product = half_reaction.split(' -> ')
          for part in reactant.split(' + '):
              match = re.match(r'(\d+)?(.*)', part)
              if match:
                  count = int(match.group(1)) if match.group(1) else 1
                  compound = match.group(2)
                  combined_reactants[compound] += count
          for part in product.split(' + '):
              match = re.match(r'(\d+)?(.*)', part)
              if match:
                  count = int(match.group(1)) if match.group(1) else 1
                  compound = match.group(2)
                  combined_products[compound] += count

      # Simplify the combined reactants and products
      for compound in list(combined_reactants.keys()):
          if compound in combined_products:
              reactant_count = combined_reactants[compound]
              product_count = combined_products[compound]
              if reactant_count == product_count:
                  del combined_reactants[compound]
                  del combined_products[compound]
              elif reactant_count > product_count:
                  combined_reactants[compound] -= product_count
                  del combined_products[compound]
              else:
                  combined_products[compound] -= reactant_count
                  del combined_reactants[compound]

      combined_reactant_str = ' + '.join(f"{count}{compound}" if count > 1 else compound for compound, count in combined_reactants.items())
      combined_product_str = ' + '.join(f"{count}{compound}" if count > 1 else compound for compound, count in combined_products.items())

      return f"{combined_reactant_str} -> {combined_product_str}"

  reactants, products = equation.split(' -> ')
  reactants = reactants.split(' + ')
  products = products.split(' + ')

  reactant_elements = [remove_oxygen_hydrogen(parse_compound_acid(reactant)) for reactant in reactants]
  product_elements = [remove_oxygen_hydrogen(parse_compound_acid(product)) for product in products]

  pairs = []
  for i in range(len(reactants)):
      for j in range(len(products)):
          if set(reactant_elements[i].keys()).intersection(set(product_elements[j].keys())):
              pairs.append((i, j))

  half_reactions = []
  for pair in pairs:
      half_reaction = f"{reactants[pair[0]]} -> {products[pair[1]]}"
      balanced_half_reaction = balance_half_reaction(half_reaction)
      balanced_half_reaction_with_charges = balance_charges(balanced_half_reaction)
      half_reactions.append(balanced_half_reaction_with_charges)

  adjusted_half_reactions = adjust_coefficients_for_lcm(half_reactions)

  def move_electron(reaction):
    left, right = reaction.split(' -> ')
    # Regex to identify electron terms in the form e^-1
    electron_pattern = r'(\d*e\^-\d+|\d*e\^-\d*|\de\^-\d*|e\^-\d*)'

    # Find and remove electron term from the left side
    left_electron_term = re.search(electron_pattern, left)
    if left_electron_term:
        electron = left_electron_term.group()
        left = left.replace(electron, '').strip(' +')
        right = right + ' + ' + electron
    else:
        # Find and remove electron term from the right side
        right_electron_term = re.search(electron_pattern, right)
        if right_electron_term:
            electron = right_electron_term.group()
            right = right.replace(electron, '').strip(' +')
            left = left + ' + ' + electron

    # Clean up multiple plus signs and spaces
    left = re.sub(r'\s*\+\s*$', '', left).strip()
    right = re.sub(r'\s*\+\s*$', '', right).strip()
    left = re.sub(r'\s*\+\s*\+', ' + ', left)
    right = re.sub(r'\s*\+\s*\+', ' + ', right)

    # Combine the left and right sides back into a single string
    new_equation = f"{left} -> {right}"

    # Ensure charges are formatted correctly
    new_equation = re.sub(r'(\d)([A-Za-z])', r'\1\2', new_equation)
    new_equation = re.sub(r'([A-Za-z])(\d)', r'\1^\2', new_equation)
    new_equation = re.sub(r'(\d)([+-])', r'\1^\2', new_equation)
    new_equation = re.sub(r'([+-])(\d)', r'\1^\2', new_equation)

    return new_equation


    #half_reactions[0] = move_electron(half_reactions[0])
    #half_reactions[1] = move_electron(half_reactions[1])
  try:
    return half_reactions[0],half_reactions[1],combine_half_reactions(adjusted_half_reactions)
  except:
    return "none"


# acid and base processing

def acid_reaction(reaction):
  def remove_states(reaction):
      # This regular expression matches the state notation (e.g., (g), (l), (s), (aq))
      state_pattern = re.compile(r'\([a-z]+\)')

      # Replace state notation with an empty string
      cleaned_reaction = state_pattern.sub('', reaction)

      # Remove any extra spaces that might result from the removal
      cleaned_reaction = re.sub(r'\s+', ' ', cleaned_reaction).strip()

      return cleaned_reaction
  def parse_reaction(reaction):
      # Split the reaction into reactants and products
      reactants_side, products_side = reaction.split(' -> ')

      # Split reactants and products into individual compounds
      reactants = reactants_side.split(' + ')
      products = products_side.split(' + ')

      # Initialize an empty dictionary to store compound states
      Rcompound_states = {}
      Pcompound_states = {}
      # Function to determine the state of each compound
      def determine_state(compound):
        if '(s)' in compound:
            return '(s)'
        elif '(l)' in compound:
            return '(l)'
        elif '(g)' in compound:
            return '(g)'
        elif '(aq)' in compound:
            return '(aq)'
        elif '(s, graphite)' in compound:
           return '(s, graphite)'
        elif '(s, diamond)' in compound:
           return '(s, diamond)'
        else:
            return '(N)'

      # Parse reactants
      for compound in reactants:
          state = determine_state(compound)
          if state != '(N)':
            compound_name = compound.split(state)[0].strip()  # Extract compound name
            Rcompound_states[compound_name] = state
          else:
            Rcompound_states[compound] = state



      # Parse products
      for compound in products:
          state = determine_state(compound)
          if state != '(N)':
            compound_name = compound.split(state)[0].strip()  # Extract compound name
            Pcompound_states[compound_name] = state
          else:
            Pcompound_states[compound] = state
      Rcompound_states['H^1+'] = '(aq)'
      Rcompound_states['OH^1-'] = '(aq)'
      Rcompound_states['H2O'] = '(l)'
      Pcompound_states['H^1+'] = '(aq)'
      Pcompound_states['OH^1-'] = '(aq)'
      Pcompound_states['H2O'] = '(l)'
      return Rcompound_states,Pcompound_states
  def add_states_to_reaction(reaction, Rstates_dict,Pstates_dict):
      # Split the reaction into reactants and products
      reactants, products = reaction.split(" -> ")

      # Split reactants and products into individual compounds
      reactants = reactants.split(" + ")
      products = products.split(" + ")

      # Function to add states to a list of compounds
      def addcharge(formula,compound):
        if '^' in compound:
          index = compound.index('^')
          charge = compound[index:]
          formula = formula + charge
          return formula
        return formula
      def add_states(compounds,states_dict):
          result = []
          for compound in compounds:
              # Match coefficient and formula using regular expression
              match = re.match(r"(\d*)([A-Za-z0-9]+)", compound)
              if match:
                  coefficient = match.group(1)
                  length = len(coefficient)
                  formula = compound[length:]
                  if coefficient:
                      compound_with_state = f"{coefficient}{formula}{states_dict.get(formula,'')}"
                  else:
                      compound_with_state = f"{formula}{states_dict.get(formula,'')}"
                  result.append(compound_with_state)
          return result

      # Add states to reactants and products
      reactants_with_states = add_states(reactants,Rstates_dict)
      products_with_states = add_states(products,Pstates_dict)
      # Join the lists back into strings
      reactants_str = " + ".join(reactants_with_states)
      products_str = " + ".join(products_with_states)

      # Construct the final reaction string
      final_reaction = f"{reactants_str} -> {products_str}"

      return final_reaction

  def finding(check):
        for substance in sub:

            if(check in substance):
                if(substance.index(check) == 0):
                    answer = substance[-3:]
                    if(substance[-3] == '('):
                        answer = substance[-3:]
                        return answer
                    elif substance[-4] == '(':
                        answer = substance[-4:]
                        return answer
                    elif 'diamond' in check:
                        answer = 'diamond'
                    elif 'graphite' in check:
                        return '(s, graphite)'
        return '(N)'
  
  def classify(compound_states):
    for compound,state in compound_states.items():
      if(state == "(N)"):
        state = finding(compound)
        compound_states[compound] = state
    return compound_states
  # Example reaction
  def transform_ion_charges(reaction):
      # Replace "1+" with "+"
      reaction = re.sub(r'\^1\+', '^+', reaction)
      # Replace "1-" with "-"
      reaction = re.sub(r'\^1-', '^-', reaction)
      return reaction
  reaction = transform_ion_charges(reaction)
  Rcompound_states,Pcompound_states = parse_reaction(reaction)
  cleaned_reaction = remove_states(reaction)
  Rcompound_states = classify(Rcompound_states)
  Pcompound_states = classify(Pcompound_states)
  try:
    first,second,balanced_reaction = acid_split_redox_reaction(cleaned_reaction)
    new_reaction = add_states_to_reaction(balanced_reaction, Rcompound_states,Pcompound_states)
  except:
      first = "N/A"
      second = "N/A"
      new_reaction = "N/A"
  
  return first,second,new_reaction
def base_reaction(reaction):
  def remove_states(reaction):
      # This regular expression matches the state notation (e.g., (g), (l), (s), (aq))
      state_pattern = re.compile(r'\([a-z]+\)')

      # Replace state notation with an empty string
      cleaned_reaction = state_pattern.sub('', reaction)

      # Remove any extra spaces that might result from the removal
      cleaned_reaction = re.sub(r'\s+', ' ', cleaned_reaction).strip()

      return cleaned_reaction
  def parse_reaction(reaction):
      # Split the reaction into reactants and products
      reactants_side, products_side = reaction.split(' -> ')

      # Split reactants and products into individual compounds
      reactants = reactants_side.split(' + ')
      products = products_side.split(' + ')

      # Initialize an empty dictionary to store compound states
      Rcompound_states = {}
      Pcompound_states = {}
      # Function to determine the state of each compound
      def determine_state(compound):
        if '(s)' in compound:
            return '(s)'
        elif '(l)' in compound:
            return '(l)'
        elif '(g)' in compound:
            return '(g)'
        elif '(aq)' in compound:
            return '(aq)'
        elif '(s, graphite)' in compound:
           return '(s, graphite)'
        elif '(s, diamond)' in compound:
           return '(s, diamond)'
        else:
            return '(N)'

      # Parse reactants
      for compound in reactants:
          state = determine_state(compound)
          if state != '(N)':
            compound_name = compound.split(state)[0].strip()  # Extract compound name
            Rcompound_states[compound_name] = state
          else:
            Rcompound_states[compound] = state



      # Parse products
      for compound in products:
          state = determine_state(compound)
          if state != '(N)':
            compound_name = compound.split(state)[0].strip()  # Extract compound name
            Pcompound_states[compound_name] = state
          else:
            Pcompound_states[compound] = state
      Rcompound_states['H^1+'] = '(aq)'
      Rcompound_states['OH^1-'] = '(aq)'
      Rcompound_states['H2O'] = '(l)'
      Pcompound_states['H^1+'] = '(aq)'
      Pcompound_states['OH^1-'] = '(aq)'
      Pcompound_states['H2O'] = '(l)'
      return Rcompound_states,Pcompound_states
  def add_states_to_reaction(reaction, Rstates_dict,Pstates_dict):
      # Split the reaction into reactants and products
      reactants, products = reaction.split(" -> ")

      # Split reactants and products into individual compounds
      reactants = reactants.split(" + ")
      products = products.split(" + ")

      # Function to add states to a list of compounds
      def addcharge(formula,compound):
        if '^' in compound:
          index = compound.index('^')
          charge = compound[index:]
          formula = formula + charge
          return formula
        return formula
      def add_states(compounds,states_dict):
          result = []
          for compound in compounds:
              # Match coefficient and formula using regular expression
              match = re.match(r"(\d*)([A-Za-z0-9]+)", compound)
              if match:
                  coefficient = match.group(1)
                  length = len(coefficient)
                  formula = compound[length:]
                  if coefficient:
                      compound_with_state = f"{coefficient}{formula}{states_dict.get(formula,'')}"
                  else:
                      compound_with_state = f"{formula}{states_dict.get(formula,'')}"
                  result.append(compound_with_state)
          return result

      # Add states to reactants and products
      reactants_with_states = add_states(reactants,Rstates_dict)
      products_with_states = add_states(products,Pstates_dict)
      # Join the lists back into strings
      reactants_str = " + ".join(reactants_with_states)
      products_str = " + ".join(products_with_states)

      # Construct the final reaction string
      final_reaction = f"{reactants_str} -> {products_str}"

      return final_reaction
  def finding(check):
        for substance in sub:

            if(check in substance):
                if(substance.index(check) == 0):
                    answer = substance[-3:]
                    if(substance[-3] == '('):
                        answer = substance[-3:]
                        return answer
                    elif substance[-4] == '(':
                        answer = substance[-4:]
                        return answer
                    elif 'diamond' in check:
                        answer = 'diamond'
                    elif 'graphite' in check:
                        return '(s, graphite)'
        return '(N)'
  def classify(compound_states):
    for compound,state in compound_states.items():
      if(state == "(N)"):
        state = finding(compound)
        compound_states[compound] = state
    return compound_states
  # Example reaction
  def transform_ion_charges(reaction):
      # Replace "1+" with "+"
      reaction = re.sub(r'\^1\+', '^+', reaction)
      # Replace "1-" with "-"
      reaction = re.sub(r'\^1-', '^-', reaction)
      return reaction
  reaction = transform_ion_charges(reaction)
  Rcompound_states,Pcompound_states = parse_reaction(reaction)
  cleaned_reaction = remove_states(reaction)
  Rcompound_states = classify(Rcompound_states)
  Pcompound_states = classify(Pcompound_states)
  try:
    first,second,balanced_reaction = base_split_redox_reaction(cleaned_reaction)
    new_reaction = add_states_to_reaction(balanced_reaction, Rcompound_states,Pcompound_states)
  except:
      first = "N/A"
      second = "N/A"
      new_reaction = "N/A"
  return first,second,new_reaction


@app.route('/base-redox-equations', methods=['POST'])
def base_redox():
    data = request.json
    
    reaction = data.get('reaction')
    
    first,second,new_reaction = acid_reaction(reaction)
    
    print(f"Returning result: {first, second, new_reaction}")
    return jsonify({'first': first, 'second': second, 'new_reaction': new_reaction})

@app.route('/acid-redox-equations', methods=['POST'])
def acid_redox():
    data = request.json
    reaction = data.get('reaction')
    first,second,new_reaction = base_reaction(reaction)
    print(f"Returning result: {first, second, new_reaction}")
    return jsonify({'first': first, 'second': second, 'new_reaction': new_reaction})

#dG dH dS K

thermo_df = read_csv("./public/thermolist.csv")
isgood = True
def round_to_sig_figs_thermo(value, sig_figs):
    """
    Rounds a number to the specified number of significant figures.
    """
    if value == 0:
        return 0

    # Calculate the number of decimal places required
    decimal_places = sig_figs - int(math.floor(math.log10(abs(value)))) - 1

    # Round the value to the specified number of decimal places
    rounded_value = round(value, decimal_places)
    # Format the value to ensure it has the correct number of significant figures

    return rounded_value
def columns_to_dict(df, key_col, value_col):
    """
    Converts two columns of a DataFrame into a dictionary.

    Parameters:
    df (pd.DataFrame): The DataFrame containing the columns.
    key_col (str): The column to be used as dictionary keys.
    value_col (str): The column to be used as dictionary values.

    Returns:
    dict: A dictionary with keys from key_col and values from value_col.
    """
    return df.set_index(key_col)[value_col].to_dict()
# Dictionary of standard Gibbs free energies (kJ/mol)
standard_gibbs_energies = columns_to_dict(thermo_df, 'Substance', 'dG(kJ/mol)')
standard_entropies = columns_to_dict(thermo_df, 'Substance', 'dS(J/mol-K)')
standard_enthalpy = columns_to_dict(thermo_df, 'Substance', 'dH(kJ/mol)')
def parse_reaction_thermo(reaction):
    # Split reaction into reactants and products
    reactants, products = reaction.split('->')
    reactants = reactants.strip().split(' + ')
    products = products.strip().split(' + ')
    #print(reactants,products)
    def parse_component(component):
        match = re.match(r'(\d*)\s*([A-Za-z0-9]+)', component.strip())
        coefficient = int(match.group(1)) if match.group(1) else 1
        substance = match.group(2)
        index = component.index('(')
        state = component[index:]
        substance = substance + state
        return coefficient, substance

    reactants = [parse_component(r) for r in reactants]
    products = [parse_component(p) for p in products]
    #print(reactants,products)

    return reactants, products

def calculate_delta_g0(reactants, products, gibbs_energies):
  try:
      # Calculate ΔG° for reactants and products
      delta_g0_reactants = sum(coef * float(gibbs_energies[substance]) for coef, substance in reactants)
      delta_g0_products = sum(coef * float(gibbs_energies[substance]) for coef, substance in products)

      # ΔG° = Σ(ΔG° products) - Σ(ΔG° reactants)
      delta_g0 = delta_g0_products - delta_g0_reactants
      return delta_g0
  except:
      return "Do not have data yet"
def calculate_delta_s0(reactants, products, entropy):
    # Calculate ΔS° for reactants and products
    try:
      delta_s0_reactants = sum(coef * float(entropy[substance]) for coef, substance in reactants)
      delta_s0_products = sum(coef * float(entropy[substance]) for coef, substance in products)

      # ΔS° = Σ(ΔS° products) - Σ(ΔS° reactants)
      delta_s0 = delta_s0_products - delta_s0_reactants
      return delta_s0
    except:
      return "Do not have data yet"
def calculate_delta_h0(reactants, products, enthalpy):
    # Calculate ΔH° for reactants and products
    try:
      delta_h0_reactants = sum(coef * float(enthalpy[substance]) for coef, substance in reactants)
      delta_h0_products = sum(coef * float(enthalpy[substance]) for coef, substance in products)

      # ΔH° = Σ(ΔH° products) - Σ(ΔH° reactants)
      delta_h0 = delta_h0_products - delta_h0_reactants
      return delta_h0
    except:
      return "Do not have data yet"


# Input reaction

#print(df)
# Parse the reaction

# Calculate ΔG°


@app.route('/delta-calculations', methods=['POST'])
def delta_calc():
    data = request.json
    
    reaction = data.get('reaction')
    reactants, products = parse_reaction_thermo(reaction)
    
    try:
        delta_g0 = calculate_delta_g0(reactants, products, standard_gibbs_energies)
        delta_s0 = calculate_delta_s0(reactants, products, standard_entropies)
        delta_h0 = calculate_delta_h0(reactants, products, standard_enthalpy)
        
        K = -delta_g0 * 1000 / (8.314 * 298)
        K = math.pow(math.e, K)
        K = round_to_sig_figs_thermo(K, 4)
        
        # Round values to 2 decimal places
        delta_g0 = round(delta_g0, 2)
        delta_s0 = round(delta_s0, 2)
        delta_h0 = round(delta_h0, 2)
        
        print(f"Returning result: {delta_g0, delta_s0, delta_h0, K}")
        return jsonify({'delta_g0': f"{delta_g0} kJ/mol", 'delta_s0': f"{delta_s0} J/mol-K", 'delta_h0': f"{delta_h0} kJ/mol", 'K': K})
        
    except Exception as e:
        print(f"Error occurred: {e}")
        # Ensure variables are defined if an error occurs
        if 'delta_g0' not in locals():
            delta_g0 = 0.0
        if 'delta_s0' not in locals():
            delta_s0 = 0.0
        if 'delta_h0' not in locals():
            delta_h0 = 0.0
        if 'K' not in locals():
            K = 0.0
        
        
        
        print(f"Returning result: {delta_g0, delta_s0, delta_h0, K}")
        return jsonify({'delta_g0': f"{delta_g0} kJ/mol", 'delta_s0': f"{delta_s0} J/mol-K", 'delta_h0': f"{delta_h0} kJ/mol", 'K': K})
    
    

# compound inputs

def split_reaction(reaction):
    def remove_coefficients(reaction):
        # Split the reaction into reactants and products
        reactants, products = reaction.split('->')
        reactants = reactants.split(' + ')
        products = products.split(' + ')

        # Helper function to remove coefficients
        def remove_coeff(compound_list):
            compound_no_coeff = []
            for compound in compound_list:
                # Remove whitespace
                compound = compound.strip()
                # Remove the coefficient (if any)
                compound_no_coeff.append(re.sub(r'^\d+', '', compound).strip())
            return compound_no_coeff

        # Remove coefficients from reactants and products
        reactants_no_coeff = remove_coeff(reactants)
        products_no_coeff = remove_coeff(products)

        # Join reactants and products back into strings
        reactants_no_coeff_str = ' + '.join(reactants_no_coeff)
        products_no_coeff_str = ' + '.join(products_no_coeff)

        # Form the new reaction
        new_reaction = reactants_no_coeff_str + ' -> ' + products_no_coeff_str
        return new_reaction
    reaction = remove_coefficients(reaction)
    print(reaction)
    # Split the reaction into reactants and products
    reactants_side, products_side = reaction.split(' -> ')

    # Split reactants and products into individual compounds
    reactants = reactants_side.split(' + ')
    products = products_side.split(' + ')
    return reactants,products

@app.route('/split-reaction', methods=['POST'])
def get_compounds():
    data = request.json
    reaction = data.get('reaction')
    r,p = split_reaction(reaction)
    print(r,p)
    return jsonify({'reactants': r, 'products': p})


#ICE

periodic = read_csv("./public/periodic-table-detailed.csv")
data_dict = periodic.set_index('symbol').to_dict()['atomic_mass']
from scipy.optimize import fsolve

def split_reaction_BI(reaction):
    def remove_coefficients(reaction):
        # Split the reaction into reactants and products
        reactants, products = reaction.split('->')
        reactants = reactants.split(' + ')
        products = products.split(' + ')

        # Helper function to remove coefficients
        def remove_coeff(compound_list):
            compound_no_coeff = []
            for compound in compound_list:
                # Remove whitespace
                compound = compound.strip()
                # Remove the coefficient (if any)
                compound_no_coeff.append(re.sub(r'^\d+', '', compound).strip())
            return compound_no_coeff

        # Remove coefficients from reactants and products
        reactants_no_coeff = remove_coeff(reactants)
        products_no_coeff = remove_coeff(products)

        # Join reactants and products back into strings
        reactants_no_coeff_str = ' + '.join(reactants_no_coeff)
        products_no_coeff_str = ' + '.join(products_no_coeff)

        # Form the new reaction
        new_reaction = reactants_no_coeff_str + ' -> ' + products_no_coeff_str
        return new_reaction
    reaction = remove_coefficients(reaction)
    print(reaction)
    # Split the reaction into reactants and products
    reactants_side, products_side = reaction.split(' -> ')

    # Split reactants and products into individual compounds
    reactants = reactants_side.split(' + ')
    products = products_side.split(' + ')
    return reactants,products

def parse_reaction_state(reaction):
    # Split the reaction into reactants and products
    reactants_side, products_side = reaction.split(' -> ')

    # Split reactants and products into individual compounds
    reactants = reactants_side.split(' + ')
    products = products_side.split(' + ')

    # Initialize an empty dictionary to store compound states
    Rcompound_states = {}
    Pcompound_states = {}
    # Function to determine the state of each compound
    def determine_state(compound):
        if '(s)' in compound:
            return '(s)'
        elif '(l)' in compound:
            return '(l)'
        elif '(g)' in compound:
            return '(g)'
        elif '(aq)' in compound:
            return '(aq)'
        else:
            return '(N)'

    # Parse reactants
    for compound in reactants:
        state = determine_state(compound)
        if state != '(N)':
          compound_name = compound.split(state)[0].strip()  # Extract compound name
          Rcompound_states[compound_name] = state
        else:
          Rcompound_states[compound] = state



    # Parse products
    for compound in products:
        state = determine_state(compound)
        if state != '(N)':
          compound_name = compound.split(state)[0].strip()  # Extract compound name
          Pcompound_states[compound_name] = state
        else:
          Pcompound_states[compound] = state
    return Rcompound_states,Pcompound_states

def dictionarypar(reaction):
    # Split the reaction into reactants and products
    reactants, products = reaction.split('->')
    reactants = reactants.split('+')
    products = products.split('+')

    # Helper function to parse each part
    def parse_compounds(compound_list):
        compound_dict = {}
        for compound in compound_list:
            # Remove whitespace
            compound = compound.strip()
            # Find the coefficient (if any)
            match = re.match(r"(\d*)(\w+)", compound)
            if match:
                coefficient = match.group(1)
                length = len(coefficient)
                formula = compound[length:]
                if coefficient == '':
                    coefficient = 1
                else:
                    coefficient = int(coefficient)
                compound_dict[formula] = coefficient
        return compound_dict

    # Parse reactants and products
    reactant_dict = parse_compounds(reactants)
    product_dict = parse_compounds(products)

    return reactant_dict, product_dict

def remove_states_BI(reaction):
    # This regular expression matches the state notation including complex states and the specific (N) state
    state_pattern = re.compile(r'\([a-z]+(?:, [a-z]+)?\)|\(\bN\b\)')

    # Replace state notation with an empty string
    cleaned_reaction = state_pattern.sub('', reaction)

    # Remove any extra spaces that might result from the removal
    cleaned_reaction = re.sub(r'\s+', ' ', cleaned_reaction).strip()

    return cleaned_reaction

def remove_coefficients(reaction):
    # Split the reaction into reactants and products
    reactants, products = reaction.split('->')
    reactants = reactants.split(' + ')
    products = products.split(' + ')

    # Helper function to remove coefficients
    def remove_coeff(compound_list):
        compound_no_coeff = []
        for compound in compound_list:
            # Remove whitespace
            compound = compound.strip()
            # Remove the coefficient (if any)
            compound_no_coeff.append(re.sub(r'^\d+', '', compound).strip())
        return compound_no_coeff

    # Remove coefficients from reactants and products
    reactants_no_coeff = remove_coeff(reactants)
    products_no_coeff = remove_coeff(products)

    # Join reactants and products back into strings
    reactants_no_coeff_str = ' + '.join(reactants_no_coeff)
    products_no_coeff_str = ' + '.join(products_no_coeff)

    # Form the new reaction
    new_reaction = reactants_no_coeff_str + ' -> ' + products_no_coeff_str
    return new_reaction

def round_to_sig_figs(value, sig_figs):
    """
    Rounds a number to the specified number of significant figures.
    """
    if value == 0:
        return 0

    # Calculate the number of decimal places required
    decimal_places = sig_figs - int(math.floor(math.log10(abs(value)))) - 1

    # Round the value to the specified number of decimal places
    rounded_value = round(value, decimal_places)

    # Format the value to ensure it has the correct number of significant figures

    return rounded_value

def find_final_concentrations(RM, PM, Rcoe, Pcoe,Rog,Pog, K):
        # Extract reactants and products
    reactants = list(Rcoe.keys())
    products = list(Pcoe.keys())
    # Define the equilibrium equations
    def equilibrium_equations(extent):
        Q = 1
        Keq = K
        for product in products:
            concentration = PM[product] + Pcoe[product] * extent
            Q *= concentration ** Pcoe[product]
        for reactant in reactants:
            concentration = RM[reactant] - Rcoe[reactant] * extent
            Keq *= concentration ** Rcoe[reactant]
        return Q - Keq

    # Initial guess for the extent of reaction
    x0 = 0

    # Solve for the extent of reaction
    extent_solution = fsolve(equilibrium_equations, x0)[0]

    # Calculate final concentrations
    finalR_concentrations = {}
    finalP_concentrations = {}
    reactants = list(Rog.keys())
    products = list(Pog.keys())
    def check(extent_solution, Rog,RM):
      x = extent_solution
      for reactant in Rog:
        if extent_solution * Rog[reactant] > RM[reactant]:
          og = x
          new = RM[reactant]/Rog[reactant]
          x -= x
          x += min(new,og)
      return x
    extent_solution = check(extent_solution,Rog,RM)

    for reactant in reactants:
        finalR_concentrations[reactant] = RM[reactant] - Rog[reactant] * extent_solution
    for product in products:
        finalP_concentrations[product] = PM[product] + Pog[product] * extent_solution
    return finalR_concentrations,finalP_concentrations

def expand_formula_BI(compound):
    while '(' in compound:
        compound = re.sub(r'\(([^\)]+)\)(\d+)', lambda m: ''.join(int(m.group(2)) * m.group(1)), compound)
    return compound
def calculate_molar_mass(formula, data_dict):
    # Regex to find elements and their counts

    pattern = re.compile(r'([A-Z][a-z]?)(\d*)')
    matches = pattern.findall(formula)

    molar_mass = 0.0

    for (element, count) in matches:
        if count == '':
            count = 1
        else:
            count = int(count)

        atomic_mass = data_dict.get(element)
        if atomic_mass is None:
            raise ValueError(f"Element {element} not found in the dictionary")

        molar_mass += atomic_mass * count
    molar_mass = round(molar_mass,2)
    return molar_mass
def massToMoles(formula,mass):
  formula = expand_formula_BI(formula)
  molar_mass = calculate_molar_mass(formula,data_dict)
  moles = mass / molar_mass
  return moles
def massToMol(formula,mass,volume):
  expanded_formula = expand_formula_BI(formula)
  molar_mass = calculate_molar_mass(expanded_formula,data_dict)
  moles = mass / molar_mass
  molarity = moles/volume
  return molarity
def molesToMol(moles,volume):
  return moles/volume
def computeQ(Rcoe,Pcoe,RMdict,PMdict):
  def computeden(Rc,RM):
    Qlist = []
    product = 1
    for compound in Rc:
      power = Rc[compound]
      molarity = RM[compound]
      value = math.pow(molarity,power)
      Qlist.append(value)
    for value in Qlist:
      product *= value
    return product
  def computenum(Pc,PM):
    Qlist = []
    product = 1
    for compound in Pc:
      power = Pc[compound]
      molarity = PM[compound]
      value = math.pow(molarity,power)
      Qlist.append(value)
    for value in Qlist:
      product *= value
    return product
  den = computeden(Rcoe,RMdict)
  num = computenum(Pcoe,PMdict)
  if den == 0 and num == 0:
    return 'NO REACTION'
  if den == 0:
    return 'UNDEFINED'
  Q = num/den
  Q = round_to_sig_figs(Q,4)
  return Q

def FixingICE(dictR,dictP,volume):
  new_dictR = {}
  new_dictP ={}
  for compound in dictR:
    if ' g' in dictR[compound]:
      index = dictR[compound].index(' g')
      mass = dictR[compound][:index]
      mass = float(mass)
      molarity = massToMol(compound,mass,volume)
      new_dictR[compound] = molarity
    elif ' moles' in dictR[compound] or ' mole' in dictR[compound] or ' mol' in dictR[compound]:
      index = dictR[compound].index(' mol')
      moles = dictR[compound][:index]
      moles = float(moles)
      molarity = molesToMol(moles,volume)
      new_dictR[compound] = molarity
    elif ' M' in dictR[compound] or ' Molarity' in dictR[compound]:
      index = dictR[compound].index(' M')
      molarity = dictR[compound][:index]
      molarity = float(molarity)
      new_dictR[compound] = molarity
    else:
      new_dictR[compound] = float(dictR[compound])
  for compound in dictP:
    if ' g' in dictP[compound]:
      index = dictP[compound].index(' g')
      mass = dictP[compound][:index]
      mass = float(mass)
      molarity = massToMol(compound,mass,volume)
      new_dictP[compound] = molarity
    elif ' moles' in dictP[compound] or ' mole' in dictP[compound] or ' mol' in dictP[compound]:
      index = dictP[compound].index(' mol')
      moles = dictP[compound][:index]
      moles = float(moles)
      molarity = molesToMol(moles,volume)
      new_dictP[compound] = molarity
    elif ' M' in dictP[compound] or ' Molarity' in dictP[compound]:
      index = dictP[compound].index(' M')
      molarity = dictP[compound][:index]
      molarity = float(molarity)
      new_dictP[compound] = molarity
    else:
      new_dictP[compound] = float(dictP[compound])
  return new_dictR,new_dictP


def FixingBCA(dictR,dictP,volume):
  new_dictR = {}
  new_dictP ={}
  for compound in dictR:
    if ' g' in dictR[compound]:
      index = dictR[compound].index(' g')
      mass = dictR[compound][:index]
      mass = float(mass)
      moles = massToMoles(compound,mass)
      new_dictR[compound] = moles
    elif ' moles' in dictR[compound] or ' mole' in dictR[compound] or ' mol' in dictR[compound]:
      index = dictR[compound].index(' mol')
      moles = dictR[compound][:index]
      moles = float(moles)
      new_dictR[compound] = moles
    elif ' M' in dictR[compound] or ' Molarity' in dictR[compound]:
      index = dictR[compound].index(' M')
      molarity = dictR[compound][:index]
      molarity = float(molarity)
      new_dictR[compound] = molarity * volume
    else:
      new_dictR[compound] = float(dictR[compound])
  for compound in dictR:
    if ' g' in dictP[compound]:
      index = dictP[compound].index(' g')
      mass = dictP[compound][:index]
      mass = float(mass)
      moles = massToMoles(compound,mass)
      new_dictP[compound] = moles
    elif ' moles' in dictP[compound] or ' mole' in dictP[compound] or ' mol' in dictP[compound]:
      index = dictP[compound].index(' mol')
      moles = dictP[compound][:index]
      moles = float(moles)
      new_dictP[compound] = moles
    elif ' M' in dictP[compound] or ' Molarity' in dictP[compound]:
      index = dictP[compound].index(' M')
      molarity = dictP[compound][:index]
      molarity = float(molarity)
      new_dictP[compound] = molarity * volume
    else:
      new_dictP[compound] = float(dictP[compound])
  return new_dictR,new_dictP

def ICE(reaction,K,RM,PM):
  '''
  Include PMdict and RMdict in input
  '''
  nocoe = remove_coefficients(reaction)
  Rcompound_states,Pcompound_states = parse_reaction_state(nocoe)
  cleaned_reaction = remove_states_BI(reaction)
  R, P = dictionarypar(cleaned_reaction)
  Rog,Pog = dictionarypar(cleaned_reaction)
  Rdeleted = []
  Pdeleted = []
  for compound in Rcompound_states:
    if Rcompound_states[compound] != '(aq)' and Rcompound_states[compound] != '(g)' and Rcompound_states[compound] != '(N)':
      Rdeleted.append(compound)
  for compound in Pcompound_states:
    if Pcompound_states[compound] != '(aq)' and Pcompound_states[compound] != '(g)' and Pcompound_states[compound] != '(N)':
      Pdeleted.append(compound)
  for compound in Rdeleted:
      del Rcompound_states[compound]
      del R[compound]
  for compound in Pdeleted:
      del Pcompound_states[compound]
      del P[compound]
  Q = computeQ(R,P,RM,PM)
  if Q == 'NO REACTION':
    finalP = PM
    finalR = RM
    return finalR,finalP, 'NO REACTION'
  if Q == 'UNDEFINED':
    Keq = 1/K
    if(Keq < 1e7):
      finalP_concentrations,finalR_concentrations = find_final_concentrations(PM, RM, P, R,Pog,Rog, Keq)
      for compound in finalR_concentrations:
        finalR_concentrations[compound] = round_to_sig_figs(finalR_concentrations[compound],3)

      for compound in finalP_concentrations:
        finalP_concentrations[compound] = round_to_sig_figs(finalP_concentrations[compound],3)
      return finalR_concentrations,finalP_concentrations,'REVERSE REACTION'
    if Keq >= 1e7:
      finalP_concentrations,finalR_concentrations = completion_final_concentrations(PM, RM, Pog, Rog)
      for compound in finalR_concentrations:
        finalR_concentrations[compound] = round_to_sig_figs(finalR_concentrations[compound],3)

      for compound in finalP_concentrations:
        finalP_concentrations[compound] = round_to_sig_figs(finalP_concentrations[compound],3)
      return finalR_concentrations,finalP_concentrations,'REVERSE REACTION'
  if Q < K:
    Keq = K
    if(Keq < 1e7):
      finalR_concentrations,finalP_concentrations = find_final_concentrations(RM, PM, R, P,Rog,Pog, Keq)
      for compound in finalR_concentrations:
        finalR_concentrations[compound] = round_to_sig_figs(finalR_concentrations[compound],3)

      for compound in finalP_concentrations:
        finalP_concentrations[compound] = round_to_sig_figs(finalP_concentrations[compound],3)
      return finalR_concentrations,finalP_concentrations,'FORWARD REACTION'
    if Keq >= 1e7:
      finalR_concentrations,finalP_concentrations = completion_final_concentrations(RM, PM, Rog, Pog)
      for compound in finalR_concentrations:
        finalR_concentrations[compound] = round_to_sig_figs(finalR_concentrations[compound],3)

      for compound in finalP_concentrations:
        finalP_concentrations[compound] = round_to_sig_figs(finalP_concentrations[compound],3)
      return finalR_concentrations,finalP_concentrations,'FORWARD REACTION'
  if Q > K:
    Keq = 1/K
    if(Keq < 1e7):
      finalP_concentrations,finalR_concentrations = find_final_concentrations(PM, RM, P, R,Pog,Rog, Keq)
      for compound in finalR_concentrations:
        finalR_concentrations[compound] = round_to_sig_figs(finalR_concentrations[compound],3)

      for compound in finalP_concentrations:
        finalP_concentrations[compound] = round_to_sig_figs(finalP_concentrations[compound],3)
      return finalR_concentrations,finalP_concentrations,'REVERSE REACTION'
    if Keq >= 1e7:
      finalP_concentrations,finalR_concentrations = completion_final_concentrations(PM, RM, Pog, Rog)
      for compound in finalR_concentrations:
        finalR_concentrations[compound] = round_to_sig_figs(finalR_concentrations[compound],3)

      for compound in finalP_concentrations:
        finalP_concentrations[compound] = round_to_sig_figs(finalP_concentrations[compound],3)
      return finalR_concentrations,finalP_concentrations,'REVERSE REACTION'
  if Q == K:
    finalP = PM
    finalR = RM
    return finalR,finalP, 'NO REACTION'
  
def completion_final_concentrations(RM, PM, R, P):
    # Step 1: Find the limiting reactant
    reactant_amounts = {key: RM[key] / R[key] for key in R}
    limiting_reactant = min(reactant_amounts, key=reactant_amounts.get)
    limiting_amount = reactant_amounts[limiting_reactant]

    # Step 2: Calculate the amount of each reactant used
    reactant_used = {key: limiting_amount * R[key] for key in R}

    # Step 3: Calculate the amount of each product formed
    products_formed = {key: limiting_amount * P[key] for key in P}

    # Step 4: Calculate final concentrations
    final_RM = RM.copy()
    final_PM = PM.copy()

    for reactant in RM:
        if reactant in R:
            final_RM[reactant] -= reactant_used.get(reactant, 0)

    for product in P:
        final_PM[product] = final_PM.get(product, 0) + products_formed.get(product, 0)

    # Combine final concentrations
    return final_RM,final_PM


def find_ending_moles(Rm, Pm, R, P):
    # Calculate the initial mole ratios for reactants
    ratios = {reactant: Rm[reactant] / coeff for reactant, coeff in R.items()}

    # Identify the limiting reactant (reactant with the smallest ratio)
    limiting_reactant = min(ratios, key=ratios.get)
    limiting_ratio = ratios[limiting_reactant]

    # Calculate the moles of products formed based on the limiting reactant
    for product, coeff in P.items():
        Pm[product] = Pm.get(product, 0) + coeff * limiting_ratio

    # Calculate the remaining moles of reactants
    for reactant, coeff in R.items():
        Rm[reactant] = Rm[reactant] - coeff * limiting_ratio

    return Rm, Pm
def BCA(reaction,RM,PM):
  nocoe = remove_coefficients(reaction)
  Rcompound_states,Pcompound_states = parse_reaction_state(nocoe)
  cleaned_reaction = remove_states_BI(reaction)
  R, P = dictionarypar(cleaned_reaction)
  final_R,final_P = find_ending_moles(RM,PM,R,P)
  for reactants in final_R:
    final_R[reactants] = round_to_sig_figs(final_R[reactants],3)
  for products in final_P:
    final_P[products] = round_to_sig_figs(final_P[products],3)
  return final_R,final_P
#ICE and BCA loading

@app.route('/ice-calculator', methods=['POST'])
def ice_loading():
    
    data = request.json
    volume = float(data.get('volume'))
    
    reaction = data.get('reaction')
    RM = data.get('RM')
    PM = data.get('PM')
    K = data.get('K')

    RM, PM = FixingICE(RM, PM, volume)
    print(RM, PM)
    R, P, string = ICE(reaction, K, RM, PM)
    
    print(f"Returning result: {R, P, string}")
    return jsonify({'R': R, 'P': P, 'string': string})

@app.route('/bca-calculator', methods=['POST'])
def bca_loading():
    data = request.json
    volume = float(data.get('volume'))
    
    reaction = data.get('reaction')
    RM = data.get('RM')
    PM = data.get('PM')

    RM, PM = FixingBCA(RM, PM, volume)
    print(RM, PM)
    remaining_reactants, final_products = BCA(reaction, RM, PM)

    for reactant in remaining_reactants:
        remaining_reactants[reactant] = round_to_sig_figs(remaining_reactants[reactant], 3)
    for product in final_products:
        final_products[product] = round_to_sig_figs(final_products[product], 3)
    
    print("Remaining Reactants:", remaining_reactants)
    print("Final Products:", final_products)
    return jsonify({'remaining_reactants': remaining_reactants, 'final_products': final_products})

if __name__ == "__main__":
    app.run(debug=True)

