import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Modal from 'react-modal';
import Footer from '../components/Footer';
import '../App.css';  // Assuming App.css contains your styles

const Questions = () => {
  const questionTopics = {
    "Chemical Foundations": [
      {
        questionHeader: "The molecular formula of glucose is C6H12O6. Find the empirical formula of glucose.",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "CH2O",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "By definition, the empirical formula of a compound is when all the subscripts of the atoms in the formula are in the lowest whole-number ratio. Currently, the ratio is 6:12:6. If we divide this ratio by 6, we have 1:2:1, so our answer is CH2O.",
        solutionImage: ""
      },
      {
        questionHeader: "What is 15.6/3.0 + 14. Equal in the correct significant figures?",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "19",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "We first deal with 15.6/3.0, this evaluates to 5.2 since 3.0 only has 2 significant figures. Then we add 5.2 to 14. This gives us 19.2. However, since the least precise decimal place is the units digit, we must round our answer to 19. ",
        solutionImage: ""
      },
      {
        questionHeader: "Which of the following is a heterogeneous mixture? \nI. Ammonia II. Water + NaCl",
        isMultipleChoice: true,
        a: "I only",
        b: "II only",
        c: "I and II",
        d: "Neither I or II",
        correctMCQ: "d",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "By definition, a heterogeneous mixture is a mixture that doesn’t have uniform composition. We can eliminate off I. Ammonia since this is a pure substance. A mixture must have two or more different types of pure substance. Although II. Water + NaCl may seem tempting, this is also not a heterogeneous mixture as water and NaCl create a solution, which is an HOMOgeneous mixture (meaning the mixture is uniform throughout) and is thus not a heterogeneous mixture. Thus, our answer is D.",
        solutionImage: ""
      },
      {
        questionHeader: "The statement 'Gravity is what pulls us down' is known as a",
        isMultipleChoice: true,
        a: "Theory",
        b: "Measurement",
        c: "Hypothesis",
        d: "Law",
        correctMCQ: "d",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "Let’s recall the definition of each of the options: Theory- A possible EXPLANATION of why a phenomenon is occurring. A theory can be disproven. Measurement- A quantitative observation Hypothesis- A prediction or explanation for an experiment   Law - A natural phenomenon that occurs by nature Gravity is described by the law of gravity, formulated by Isaac Newton. This law explains the force that pulls objects towards each other, which is why we are pulled down towards the Earth, so our answer is D.",
        solutionImage: ""
      },
      {
        questionHeader: "How many significant figures does 0.0800910 have?",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "6",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "This problem can be solved by noting that leading zeroes are not counted as significant figures, but all the other types of zeroes are included. Thus, our answer is simply the number of digits after and including 8, so 6.",
        solutionImage: ""
      },
      {
        questionHeader: "Which of the following is NOT a unit of volume?",
        isMultipleChoice: true,
        a: "mL",
        b: "cm^3",
        c: "kg",
        d: "gal",
        correctMCQ: "c",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "All of the options are a unit of volume except for C, which is a unit of mass. ",
        solutionImage: ""
      },
      {
        questionHeader: "What is the oxidation number of rhenium in Ca(ReO4)2? USNCO 2011 Local Exam",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "+7 or 7 or 7+",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "We know that when in an ionic compound, Calcium tends to form a Ca2+ ion since it is a group 2 alkaline earth metal. Thus, this means that the charge of the ClO4 polyatomic ion is a -1 since two of this polyatomic ion end up canceling the 2+ charge from the Calcium ion. Let the oxidation number of Cl be x. In most cases, oxygen tends to have a -2 charge. So have the equation x-8 = -1, solving for x, we get 7+. ",
        solutionImage: ""
      },
      {
        questionHeader: "If in a hypothetical reaction, a compound with a mass of 26.9 g decomposes into 3 other compounds. If 2 of the compounds from the products have a mass of 12.3 g and 5.9 g respectively, what is the mass of the third product according to the Law of Conservation of Mass?",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "8.7",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "By conservation of mass, the amount of mass used up on the reactant’s side must be equal to the mass-produced on the product’s side. Thus, we have 12.3 + 5.9 + x = 26.9 where x is the mass of the third product. Solving for x, we get the amount of mass of the third product is x=8.7g ",
        solutionImage: ""
      },
      {
        questionHeader: "A student conducts an experiment to find the value of acceleration due to gravity and calculates a value of 9.977 m/s^2. Given the actual value is equal to 9.81 m/s^2, find the percent error to the correct significant figures",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "1.7",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "This question can be solved through using the percent error formula through careful tracking of the significant figures. The formula for percent error is as followings: % error = |experimental - actual|/actual*100 = |9.977 - 9.81|/9.81 * 100 = 0.17/9.81* 100 = 1.7%. Note that we wrote 9.977-9.81 as 0.17. This is because the least precise significant figure was the hundredths digit.",
        solutionImage: ""
      }
    ],
    "Chemical Compounds Naming": [
      // Easy
      {
        questionHeader: "NH4NO3",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Ammonium Nitrate",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "K3PO4",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Potassium Phosphate",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "Co3(PO4)2",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Cobalt (II) Phosphate",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "H2SO4",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Sulfuric acid",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "H2SO3",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Sulfurous acid",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "HI",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Hydroiodic acid",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "H2S",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "hydrosulfuric acid",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "HgO",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Mercury (II) oxide",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "Ammonia",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "NH3",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "PBr3",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Phosphorus tribromide",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "Potassium permanganate",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "KMnO4",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "Sodium hydroxide",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "NaOH",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "Oxygen Difluoride",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "OF2",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      // Hard
      {
        questionHeader: "Sr3(BO3)2",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Strontium borate",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "HClO2",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Chlorous acid",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "Sr(HCO3)2",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Strontium bicarbonate",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "NaF*5H2O",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Sodium fluoride pentahydrate",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "Mercury(I) Nitrate",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Hg2(NO3)2",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      },
      {
        questionHeader: "Iron(III) thiocyanate",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Fe(SCN)3",
        hasSolution: false,
        hasSolutionImage: false,
        solutionText: "",
        solutionImage: ""
      }
    ],
    "Laboratory Application": [
      {
        questionHeader: "What color does Strontium show in the flame test?",
        isMultipleChoice: true,
        a: "Orange",
        b: "Yellow",
        c: "Pink",
        d: "Red",
        correctMCQ: "d",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "Strontium compounds typically show a red color in the flame test due to the emission of light at characteristic wavelengths.",
        solutionImage: ""
      },
      {
        questionHeader: "A student possesses a 0.01 M solution of HNO3 and distilled water. He wants to dilute the acid inside of an Erlenmeyer flask. How should he prepare the diluted solution?",
        isMultipleChoice: true,
        a: "Add all of the water first, and then add the all the acid",
        b: "Add some water first, add all the acid, and then add the rest of the water",
        c: "Add all the acid first, then add all the water",
        d: "Add some acid first, add all the water, and then add the rest of the acid",
        correctMCQ: "b",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "When diluting acid, add some water first, then add the acid, and finally add the rest of the water to ensure proper mixing and avoid splashing.",
        solutionImage: ""
      },
      {
        questionHeader: "Which of the following metals should NOT be placed near water?",
        isMultipleChoice: true,
        a: "Rb",
        b: "Ag",
        c: "Au",
        d: "Cu",
        correctMCQ: "a",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "Group 1 metals like Rb (rubidium) react violently with water, forming alkali hydroxides and hydrogen gas, which can be explosive.",
        solutionImage: ""
      },
      {
        questionHeader: "A student is planning on preparing a solution by dissolving potassium permanganate in distilled water to be used for titration with hydrogen peroxide. Which of the following equipment should the student create the potassium permanganate solution in?",
        isMultipleChoice: true,
        a: "Beaker",
        b: "Erlenmeyer Flask",
        c: "Volumetric Flask",
        d: "Graduated cylinder",
        correctMCQ: "b",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "An Erlenmeyer flask is suitable for mixing solutions because it reduces the risk of spillage and allows for thorough mixing.",
        solutionImage: ""
      },
      {
        questionHeader: "When the pH decreases from 2 to 0, by what factor has the concentration of hydronium ions changed?",
        isMultipleChoice: false,
        a: "",
        b: "",
        c: "",
        d: "",
        correctMCQ: "",
        openAnswer: "Increased by a factor of 100",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "pH is the negative logarithm of the hydronium ion concentration. A decrease of 2 pH units corresponds to a 100-fold increase in [H+].",
        solutionImage: ""
      },
      {
        questionHeader: "The value of which concentration unit for a solution changes with temperature?",
        isMultipleChoice: true,
        a: "molarity",
        b: "molality",
        c: "mole fraction",
        d: "mass percentage",
        correctMCQ: "a",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "Molarity depends on the volume of the solution, which changes with temperature due to thermal expansion or contraction.",
        solutionImage: ""
      },
      {
        questionHeader: "Which of the following ionic compounds would not dissolve in water?",
        isMultipleChoice: true,
        a: "NaNO3",
        b: "CaF2",
        c: "(NH4)2CO3",
        d: "Pb(C2H3O2)2",
        correctMCQ: "b",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "Calcium fluoride (CaF2) is poorly soluble in water due to its strong ionic bonds and lattice energy.",
        solutionImage: ""
      },
      {
        questionHeader: "Which of the following reactions would not result in the formation of gas?",
        isMultipleChoice: true,
        a: "Combustion of 1-propanol",
        b: "Sublimation of dry-ice",
        c: "Reaction between Sodium carbonate and hydroiodic acid",
        d: "Synthesis reaction between oxygen gas and potassium chloride",
        correctMCQ: "d",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "The synthesis reaction between oxygen gas and potassium chloride forms a solid ionic compound without gas production.",
        solutionImage: ""
      },
      {
        questionHeader: "A student has a solution of an unknown compound, and the student wants to figure out whether the compound contains fluoride ions or not. Which of the following cations should the student NOT use?",
        isMultipleChoice: true,
        a: "Pb2+",
        b: "Mg2+",
        c: "Ba2+",
        d: "NH4+",
        correctMCQ: "d",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "Ammonium (NH4+) does not form an insoluble precipitate with fluoride ions, unlike Pb2+, Mg2+, and Ba2+.",
        solutionImage: ""
      }
    ],
    "Periodicity": [
      {
        questionHeader: "Which of the following atoms has the largest atomic radius?",
        isMultipleChoice: true,
        a: "C",
        b: "N",
        c: "Si",
        d: "P",
        correctMCQ: "c",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "Let's first consider the energy level. The higher the energy level that the valence electrons are in, the greater the atomic radius, so we can eliminate A and B from this observation. When comparing Si and P, we can note that since Phosphorus has a greater atomic number, the nuclear charge is stronger and pulls on the valence electron closer to the nucleus, thus reducing the atomic radius more than the Si does. Therefore, our answer is C. Si.",
        solutionImage: ""
      },
      {
        questionHeader: "Consider the following elements listed, which of the following has the smallest ionization energy?",
        isMultipleChoice: true,
        a: "K",
        b: "Ca",
        c: "Na",
        d: "Mg",
        correctMCQ: "a",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "Note that the elements with the smallest ionization energy are the elements such that the nucleus and valence electrons have the least attraction, thus decreasing the amount of energy needed to break the attraction to remove the electron. By Coulomb's law, A. K has the smallest ionization energy due to its size and small nuclear charge compared to Ca.",
        solutionImage: ""
      },
      {
        questionHeader: "Which of the following can have both positive and negative values?",
        isMultipleChoice: true,
        a: "Ionization energy",
        b: "Electron affinity",
        c: "Lattice energy",
        d: "Atomic radius",
        correctMCQ: "b",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "By definition, ionization energy is the energy required to remove an electron from an atom, which is always a positive amount of energy. Similarly, lattice energy is the amount of energy to separate an ionic compound into the gaseous cation and anions, which always requires a positive amount of energy. Similarly, atomic radius is a length, so that's always positive. However, electron affinity can be positive or negative. This is the energy absorbed or released when an electron is added to an atom. For some atoms, the electron repulsion is so strong that it takes energy to add an electron (Nitrogen) while other elements will release energy from adding an electron (like Chlorine) from the attraction between the nucleus and the electron, so our answer is B.",
        solutionImage: ""
      },
      {
        questionHeader: "Which of the following correctly orders the atomic radius of Si4+, Si, and Si4-?",
        isMultipleChoice: true,
        a: "Si^4+ > Si > Si^4-",
        b: "Si^4- > Si > Si^4+",
        c: "Si^4- > Si^4+ > Si",
        d: "Si > Si^4+ > Si^4-",
        correctMCQ: "b",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "Let’s consider which of the following would have the smallest atomic radius first. Note that Si4+ would have one less energy level than Si and Si4- since it loses all of its valence electrons. Thus, Si4+ would have the smallest atomic radius. Next, we compare Si and Si4-. Note that from the added electrons, Si4- would have a greater atomic radius. This is because the increased electron repulsion between the valence electrons makes the valence electrons further from the nucleus and thus increases the atomic radius. Thus, our order is Si^4- > Si > Si^4+.",
        solutionImage: ""
      },
      {
        questionHeader: "Which of the following has the lowest first ionization energy?",
        isMultipleChoice: true,
        a: "Mg",
        b: "Al",
        c: "Ca",
        d: "Ga",
        correctMCQ: "d",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "Let’s first compare the energy levels of the elements shown. Elements with valence electrons at a higher energy level tend to have lower ionization energy since the electrons are farther from the nucleus and thus the attraction between the nucleus and electrons are weaker by Coulomb’s law. Thus, we can eliminate Mg and Al since they have a lower energy level. When considering Ga and Ca, note that Ga has its highest energy valence electron at the p sublevel. Since p sublevels electrons are higher energy, these p electrons are easier to remove than the valence s electrons from Ca despite the fact that Ga has a stronger nuclear charge than Ca. Thus, our answer is D. Ga.",
        solutionImage: ""
      },
      {
        questionHeader: "Which of the following has the greatest atomic radius?",
        isMultipleChoice: true,
        a: "K+",
        b: "Cl-",
        c: "S^2-",
        d: "P^3-",
        correctMCQ: "d",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: false,
        solutionText: "First, note that all of the following atoms/ions have the same amount of electrons (isoelectronic). This means all of the particles listed above have the same amount of electron repulsion and energy level. Thus, we then look at the nuclear charge of each of the elements listed above. Phosphorus has the least nuclear charge since it has the smallest atomic number. For this reason, the attraction between the nucleus and electrons is the smallest for P^3- as there are fewer protons and positive charges to pull the negative electrons closer to the nucleus by Coulomb’s law. Therefore, the electrons are the furthest away in P^3- and thus the greatest atomic radius belongs to D. P^3-.",
        solutionImage: ""
      },
      {
        questionHeader: "Which of the following has the highest second ionization energy?",
        isMultipleChoice: true,
        a: "F",
        b: "O",
        c: "Cl",
        d: "S",
        correctMCQ: "b",
        openAnswer: "",
        hasSolution: true,
        hasSolutionImage: true,
        solutionText: "",
        solutionImage: "/solutions/periodicity_1.png"
      }
    ],
    "Stoichiometry": [
    {
      questionHeader: "1-Propanol is a compound that has the elements C,H,O with a percent mass of 59.9% and 26.6% for C and O respectively. Find the empirical formula for 1-Propanol.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "C3H8O",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Stoichiometry_1.png"
    },
    {
      questionHeader: "How many moles of O2 are required for the complete combustion of 2.2 g of C3H8 to form CO2 and H2O? USNCO 2011 Local Exam",
      isMultipleChoice: true,
      a: "0.050",
      b: "0.15",
      c: "0.25",
      d: "0.50",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "First we must write the balanced reaction. C3H8 + 5 O2 → 3 CO2 + 4 H2O. Now we can do dimensional analysis. 2.2 g C3H8 × 1 mol C3H8/ 44.09 g C3H8 × 5 mol O2/ mol C3H8 = 0.25 mol O2. Thus, the answer is C.",
      solutionImage: ""
    },
    {
      questionHeader: "How many atoms of hydrogen are in 92. g of C2H5OH? Give your answer to the correct sig fig.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "7.2 x 10^24",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Stoichiometry_2.png"
    },
    {
      questionHeader: "In a sample consisting of 1.00 mol NaBr and 0.300 mol KI, what is the mass percent of iodine? USNCO 2017 Local Exam",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Stoichiometry_3.png"
    },
    {
      questionHeader: "Hydrogen gas reacts with 5.00 L of nitrogen gas under constant temperature and pressure conditions to form 10.0 L of ammonia gas. What is the minimum volume of hydrogen gas required to produce this amount of ammonia? USNCO 2018 National Exam",
      isMultipleChoice: true,
      a: "5.00 L",
      b: "7.50 L",
      c: "15.0 L",
      d: "30.0 L",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Stoichiometry_4.png"
    },
    {
      questionHeader: "Consider the following reaction: CH4 + 2O2 -> 2H2O + CO2. A student initially has 54 g of CH4 and 90. g of O2. Find the number of grams of CO2 produced from the reaction.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "62 grams",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Stoichiometry_5.png"
    },
    {
      questionHeader: "A 65.25 g sample of CuSO4•5H2O is dissolved in enough water to make 0.800 L of solution. What volume of this solution must be diluted with water to make 1.00 L of 0.100 M CuSO4? (A) 3.27 mL (B) 81.6 mL (C) 209 mL (D) 306 mL  USNCO 2011 Local Exam",
      isMultipleChoice: true,
      a: "3.27 mL",
      b: "81.6 mL",
      c: "209 mL",
      d: "306 mL",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Stoichiometry_6.png"
    },
    {
      questionHeader: "Barium chloride reacts with sodium sulfate according to the following equation: BaCl2(aq) + Na2SO4(aq) -> BaSO4(s) + 2 NaCl(aq). A student mixes a solution containing 10.0 g BaCl2 (M = 208.2) with a solution containing 10.0 g Na2SO4 (M = 142.1) and obtains 12.0 g BaSO4 (M = 233.2). What is the percent yield of this reaction? USNCO 2017 Local Exam",
      isMultipleChoice: true,
      a: "60.0%",
      b: "73.1%",
      c: "93.3%",
      d: "The isolated barium sulfate is most likely wet, since the yield would otherwise be greater than 100%.",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Stoichiometry_7.png"
    },
    {
      questionHeader: "A student is planning on mixing 50.0 mL solution of 0.50 M NaCl with 20.0 mL solution of 0.75 M AgNO3 in a beaker and wants to calculate the new concentration of Cl-. Find this new concentration to the correct significant figure.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "0.14 M",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Stoichiometry_8.png"
    },
    {
      questionHeader: "Upon heating in a stream of hydrogen gas, 0.688 g of a manganese oxide is reduced to metallic manganese and forms 0.235 g water. What is the formula of the oxide? USNCO 2018 National Exam",
      isMultipleChoice: true,
      a: "MnO",
      b: "Mn2O3",
      c: "Mn3O4",
      d: "MnO2",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Stoichiometry_9.png"
    },
    {
      questionHeader: "A student is planning on preparing a sample of potassium oxide to react with carbon dioxide to form potassium carbonate. Currently, at 298 K, the vessel containing the CO2 gas has a volume of 4.0 L and a pressure of 2.2 atm. Find the mass of Potassium oxide in grams required to use up all the CO2 within the vessel.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "34 g",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Stoichiometry_10.png"
    }
  ],
  "Atomic structure": [
    {
      questionHeader: "How many orbitals does the s sublevel have?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "1",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, the s sublevel has 1 orbital that can fill 2 electrons.",
      solutionImage: ""
    },
    {
      questionHeader: "How many orbitals does the p sublevel have?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "3",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, the p sublevels has 3 orbitals.",
      solutionImage: ""
    },
    {
      questionHeader: "How many orbitals does the d sublevel have?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "5",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, the d sublevels has 5 orbitals.",
      solutionImage: ""
    },
    {
      questionHeader: "How many orbitals does the f sublevel have?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "7",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, the f sublevel has 7 orbitals.",
      solutionImage: ""
    },
    {
      questionHeader: "A gas phase atom with the electron configuration 1s2 2s2 2p6 3s2 3p6 4s2 3d6 loses three electrons. What is the electron configuration of the resulting gas phase ion?",
      isMultipleChoice: true,
      a: "1s2 2s2 2p6 3s2 3p6 3d5",
      b: "1s2 2s2 2p6 3s2 3p6 4s1 3d4",
      c: "1s2 2s2 2p6 3s2 3p6 4s2 3d3",
      d: "1s2 2s2 2p6 3s2 3p5 4s1 3d5",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider the first two electrons that are lost first. These two electrons would be from the 4s sublevel. This is because the electrons that first come off the atom are the electrons with the most energy. By the Aufbac principle, those electrons are the 4s electrons followed by the 3d electrons. So we lose all our 4s electrons and 1 electron from the 3d sublevel. Our answer is A.",
      solutionImage: ""
    },
    {
      questionHeader: "How many of the following statements are true regarding atomic structure? I. The energy released by atoms when going from excited to neutral state is quantized. II. The energy released and wavelength of the photon are inversely related III. It is possible for scientists to track the exact location of an electron",
      isMultipleChoice: true,
      a: "0",
      b: "1",
      c: "2",
      d: "3",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let's consider each statement at a time. The first statement is true since this is why we can consider light as both waves and a group of particles of photons. Statement II is also true as we can say energy released is directly proportional to frequency, and frequency is inversely proportional to wavelength. Finally statement III is false since we can't track the location of an electron as said by Heisenberg Uncertainty principle, so our answer is C.2.",
      solutionImage: ""
    },
    {
      questionHeader: "Consider a Ni2+ ion. How many s orbitals does the Nickel ion occupy?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "3",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider the electron configuration of Nickel when it’s a neutral atom. The configuration is 1s2 2s2 2p6 3s2 3p6 4s2 3d8. The 2 electrons that would be lost from Nickel turning into a cation would be from 4s since those electrons have the most energy. Thus, the new electron configuration is 1s2 2s2 2p6 3s2 3p6 3d8. Therefore, the Nickel ion occupies 3 s orbitals as shown in the configuration.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following are the quantum numbers of the electron with the most energy in Ga?",
      isMultipleChoice: true,
      a: "(4, 0, 0, ½)",
      b: "(4, 1, -1, ½)",
      c: "(4, 2, -3, -½)",
      d: "(4, 2, 0, ½)",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let's consider the valence electron configuration of Ga. Since this is a transition metal, the configuration is 4s2 4p1. Thus, our energy level is 4. However, remember that the p sublevels have more energy than the electrons in a sublevel by the Aufbac principle. So the l is equal to 1 and our answer is B.",
      solutionImage: ""
    },
    {
      questionHeader: "After an electron returned to neutral state from excited state, the atom released a photon with a wavelength of 423 nm. Find the energy released by the electron.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "4.70*10^-19 J",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Atomic_structure_1.png"
    },
    {
      questionHeader: "It is known that when computing electron configuration, the 4s orbitals are filled before the 3d orbitals, which of the following principles are the reason for this?",
      isMultipleChoice: true,
      a: "Hund’s rule",
      b: "Pauli exclusion principle",
      c: "Heisenberg Uncertainty principle",
      d: "Aufbac principle",
      correctMCQ: "d",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Note that the reason behind filling up the p orbitals before the d orbitals is due to the fact that p orbitals have lower energy for the electrons. This is exactly what is said in the Aufbac principle, so our answer is D.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following gas-phase ions has the largest number of unpaired electrons in its ground state? USNCO 2017 Local Exam",
      isMultipleChoice: true,
      a: "Cr3+",
      b: "Co3+",
      c: "Ni2+",
      d: "Cu2+",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Atomic_structure_2.png"
    },
    {
      questionHeader: "A certain element at an excited state has an electron configuration of [Ar]4s2 3d6 4p1. Find this element based on this configuration.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "Cobalt/Co",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "When dealing with these problems, we can’t simply use the electron configuration to track the element since the element is in an excited state. However, we can simply add up all the electrons of the atom, and that will be equal to the atomic number since no electrons left the atom. The atomic number is 18+2+6+1 = 27, so our answer is Cobalt/Co.",
      solutionImage: ""
    },
    {
      questionHeader: "How many of the following statements are correct? I. p sublevels tend to have higher energy than d sublevels of the same energy level. II. Orbitals of the same sublevel have the same energy as each other. III. Electrons from the same orbital have the same spins as each other.",
      isMultipleChoice: true,
      a: "0",
      b: "1",
      c: "2",
      d: "3",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider each of the following statements one at a time. Statement I is false since d sublevels have more energy than p sublevels according to the Aufbac principle. This is why we fill up the 3p orbitals before the 3d orbitals (and also the 4s orbitals before 3d). Statement II is true as this is the reason why when adding electrons, we can arbitrarily pick which orbital to add the electrons to in a sublevel. Finally, statement III is false since the electrons in the same orbital have opposite spins. This is why we have the magnetic spin number denoted as ½ and -½. Thus, our answer is B.1.",
      solutionImage: ""
    },
    {
      questionHeader: "An element X has valence electron configuration of ns2np4 and is forming a bond with another element that has a valence electron configuration Y of ns2np1. Find the compound formula of the compound that would be formed by X and Y.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "Y2X3",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider what type of compound X and Y would form. Since X is a group 6 element and Y is a group 3 element, this seems like it would be an ionic compound where Y would lose its 3 valence electrons while X gains 2 more electrons to complete its octet. Thus, we would have X with a charge of 2- and Y with a charge of 3+. Thus, our answer is Y2X3.",
      solutionImage: ""
    },
    {
      questionHeader: "Consider a hydrogen atom. It is known that when an electron goes from a higher energy state back to a lower energy state releases energy with a specific wavelength. Which of the following releases a photon with the greatest wavelength?",
      isMultipleChoice: true,
      a: "5 to 2",
      b: "6 to 3",
      c: "4 to 1",
      d: "7 to 4",
      correctMCQ: "d",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Atomic_structure_3.png"
    }
  ],
  "Bonding": [
    {
      questionHeader: "Which of the following species exhibits both ionic and covalent bonds?",
      isMultipleChoice: true,
      a: "CaS",
      b: "NH4HSO4",
      c: "Cs",
      d: "H2CO3",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s exhibit each of the following options: CaS only exhibits ionic bonds between Ca2+ and S2-. Cs doesn’t exhibit ionic nor covalent bonds as Cs only exhibits metallic bonds. H2CO3 only exhibits covalent bonds as there are no cations (remember, there are only really strong polar covalent bonds between the hydrogens and the oxygens, but they aren’t ionic bonds!). Thus, our answer is B. NH4HSO4. This is because there is an ionic bond between the polyatomic cation NH4+ and polyatomic ion HSO4-. Both of these polyatomic ions (NH4+ and HSO4-) are held together by covalent bonds, so our answer is B. NH4HSO4.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following species exhibits an sp hybridization at the central atom.",
      isMultipleChoice: true,
      a: "NO2",
      b: "H2O",
      c: "SO2",
      d: "CO2",
      correctMCQ: "d",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s solve this problem by drawing out all the lewis structure for each of the options. For NO2, the central atom Nitrogen has 3 electron domains since it forms bonds with each the Oxygens and has a singe lone electron. This means NO2 has an sp2 hybridization and is therefore not correct. As for H2O, the central atom oxygen has 4 electron domains as it has a bond with each of the hydrogens and 2 lone electron pairs. Thus, water has an sp3 hybridization and is not correct. As for SO2, the sulfur central atom forms a bond with each of the oxygens and also has one lone pair, so it has 3 electron domains and thus does not have a sp2 hybridization. Finally, CO2 does have a sp hybridization as the carbon only forms bonds with the oxygens and doesn’t have any lone pairs. This makes the carbon only have 2 electron domains and thus exhibit sp hybridization, so our answer is D.",
      solutionImage: ""
    },
    {
      questionHeader: "What is the molecular geometry of XeF4?",
      isMultipleChoice: true,
      a: "Octahedral",
      b: "Square planar",
      c: "See-saw",
      d: "T-Shaped",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "We first draw out the lewis structure of XeF4. We can see that Xe has a bond with each of the fluorine atoms and 2 lone pairs. This means its electron domain geometry is octahedral, and since it has 2 lone pairs, our structure is simple B. Square planar as the first two electrons to come off are the elctrons on the axis.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following compounds does NOT have a sp3 hybridization?",
      isMultipleChoice: true,
      a: "NH3",
      b: "PF3",
      c: "BCl3",
      d: "H2O",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Rather than drawing out all the compounds’ lewis structure, we could quickly recognize that our answer is C. BCl3. This is because Boron is an exception and tends to form 3 bonds only. This is the case for BCl3 and so the number of electron domains for Boron is 3. Thus, the hybridization for BCl3 is sp2 and is not sp3.",
      solutionImage: ""
    },
    {
      questionHeader: "How many of the following statements are true: Resonance structures consist of two or more possible lewis structures of a compound. The basis of all bonds comes down to electron-proton electrostatic attraction. The less electronegative difference between atoms, the more polar the bond is.",
      isMultipleChoice: true,
      a: "0",
      b: "1",
      c: "2",
      d: "3",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider each statement at a time. Statement I is true since that is the definition of Resonance structures. We draw resonance structures when there are two or more possible lewis structures of a compound. Statement II is also true as that is the reasoning for why bonds exist. The difference between nonpolar and polar covalent, and ionic bonds are the degree of attraction between the proton of one atom to the electrons of another atom. Finally, statement III is false since atoms with greater electronegative difference forms stronger and more polar bonds as there is an unequal sharing of electrons, so our answer is C.2.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following has the most pi bonds?",
      isMultipleChoice: true,
      a: "C2H2",
      b: "C2H4",
      c: "C2H5OH",
      d: "O2",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "We can solve this problem by recalling that double bonds have 1 pi bond and 1 sigma bond while triple bonds have 2 pi bonds and 1 sigma bond. Drawing out all of the lewis structures, we see that C2H2 has 1 triple bond, C2H4 has 1 double bond, C2H5OH has neither, and O2 has 1 double bond. Thus, A is our answer since it is the only choice that has a triple bond and thus 2 pi bonds.",
      solutionImage: ""
    },
    {
      questionHeader: "How many of the following statements are true: Bond energy and bond lengths are directly proportional. Polar covalent bonds have higher bond enthalpy than non-covalent bonds.",
      isMultipleChoice: true,
      a: "I only",
      b: "II only",
      c: "Both I and II",
      d: "Neither I or II",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let's consider each statement one at a time. First statement is false since the shorter the bond means the stronger the attraction between the two atoms and thus it'll take more energy to break the bond (greater bond energy). The second statement is correct since polar covalent bonds means there's an uneven sharing of electrons between the two atoms and so there would be a stronger electrostatic attraction between the two atoms from this uneven distribution. Thus, it would take more energy to break this stronger polar bond, so our answer is B.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following has the greatest lattice energy?",
      isMultipleChoice: true,
      a: "MgO",
      b: "MgS",
      c: "NaF",
      d: "NaCl",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "We can solve this problem by considering Coulomb's law, which states that greater charges and smaller distances create stronger attractions. From stronger attraction would lead to greater lattice energy to break the attraction. Looking at our answer choices, we see that A. MgO has the highest charges from Mg2+ and O2- and the smallest atomic radius, so that is our answer.",
      solutionImage: ""
    },
    {
      questionHeader: "Which species has the largest bond angle? USNCO Local Exam 2011",
      isMultipleChoice: true,
      a: "NO2+",
      b: "NO2",
      c: "NO2-",
      d: "NO3-",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "We can solve this problem by drawing out each of the lewis structures of each of the following compounds. Out of them, NO2+ exhibits a linear geometry. This means that the bond angle would be 180 degrees. No other compounds exhibit linear geometry, so our answer is A. NO2+.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following compounds has a non-zero dipole moment? USNCO 2012 Local Exam",
      isMultipleChoice: true,
      a: "CO2",
      b: "AsH3",
      c: "CCl4",
      d: "PF5",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Note that for all of the compounds except AsH3, the molecular geometry is symmetrical and thus all the dipole moments from the polar bonds cancel out. This is because of the fact that none of those compounds has any lone pairs that can lead to a lack of symmetry. This is the case for all except for AsH3. In AsH3, the lone pair on As causes the geometry to be trigonal pyramidal and the dipole moments to not cancel out, so our answer is B.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following statements are true regarding bonding? I. When atoms get too close to each other, there is an electrostatic repulsion. II. In order to create a bond, energy must be absorbed by the atoms.",
      isMultipleChoice: true,
      a: "I only",
      b: "II only",
      c: "Both I and II",
      d: "Neither I or II",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider each of the statements one at a time. Statement I is true. This is because as the atoms are too close, the protons would begin to exert repulsive forces on each other since like charges repel. Statement II however is false since bond formation releases energy. This is best explained by the fact that bonds lower the overall potential energy of the system, so our answer is A.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following compounds has the highest bond enthalpy for its N-O bond?",
      isMultipleChoice: true,
      a: "NO2+",
      b: "NO2",
      c: "NO2-",
      d: "NO3-",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "In order to determine which compound has the highest bond enthalpy, we must determine which of the compounds has the stronger N-O bond, and that is dictated by which of the compounds has the highest bond order as higher bond order means stronger bonds and higher bond energy/enthalpy. Let’s consider each of the lewis structures. Remember, if the compound has a resonance structure, the bond order is simply the average of the number of bonds on each N-O bond. Otherwise, if there are no resonance structures, then the bond order is just 2 when it’s double bond or 3 when it’s triple bond, etc. After drawing all the lewis structures, we see that A.NO2+ has the highest bond order of 2 while all the other bond orders are between 1 and 2, so that is our answer.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following has the strongest net dipole moment?",
      isMultipleChoice: true,
      a: "CF4",
      b: "PF3",
      c: "NF3",
      d: "PCl3",
      e: "NCl3",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "To approach this problem, we must first notice that A is out of the box since CF4 has a symmetric tetrahedral geometry and thus has a net zero dipole. Now when comparing the other 4 compounds, note that all of them have the same molecular geometry with trigonal pyramidal. Now in order to determine the strength of the dipole, we must think about the polarity of the bonds. The more polar the bond, the stronger the net dipole. Thus, we can turn to calculating which of the following has the greatest electronegative difference between the two elements as that would create the most polar bonds. Checking our options gives us that P-F bond has the greatest electronegative difference and so our answer is B.PF3.",
      solutionImage: ""
    }
  ],
  "IMF and Solutions": [
    {
      questionHeader: "What is the phase transition from solid to gas called?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "Sublimation",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, the reaction from solid to gas is sublimation.",
      solutionImage: ""
    },
    {
      questionHeader: "What is the phase transition from liquid to gas called?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "Vaporization",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, the reaction from liquid to gas is vaporization.",
      solutionImage: ""
    },
    {
      questionHeader: "What is the phase transition from gas to solid called?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "Deposition",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, the reaction from gas to solid is deposition.",
      solutionImage: ""
    },
    {
      questionHeader: "What is the phase transition from liquid to solid called?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "Freezing",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, the reaction from liquid to solid is called freezing.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following has the lowest freezing point?",
      isMultipleChoice: true,
      a: "1.50 M of AgCl",
      b: "0.20 M of KCl2",
      c: "0.75 M of NaOH",
      d: "1.20 M of C2H6O",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "In order to find which of the following has the lowest freezing point, we must think back to colligative property. Recall that the freezing point depression is directly related to the product of the i factor and the molality of the solution. Since we weren’t given the molality, we will use the molarity instead to estimate molality. For option A, we know that the i factor is between 1 and 2 since AgCl is an insoluble compound, so the product is between 1.50 and 3.00. Next, 0.20 M KCl2 gives us a product of 0.60 since i = 3. 0.75 M of NaOH gives us 1.50 since i = 2, and finally 1.20 M of C2H6O gives a product of 1.20 since i = 1. Thus, the greatest product belongs to 1.50 M of AgCl since its i factor is between 1 and 2 and so is greater than the 1.50 from NaOH. Our answer is A.",
      solutionImage: ""
    },
    {
      questionHeader: "Above is shown the heating curve of a compound. At which of the following points is the compound in two states at once?",
      isMultipleChoice: true,
      a: "A",
      b: "B",
      c: "C",
      d: "D",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Note that for a compound to be at two states at once, it must be at one of the plateaus of the heating curve as shown in B. This is because this shows the compound transitioning from one state to another from an increase in potential energy. During this phase change, we can consider the compound to be at two different states.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following attractions generally has the highest melting points?",
      isMultipleChoice: true,
      a: "Covalent network",
      b: "Metallic bondings",
      c: "Ionic bonds",
      d: "Intermolecular forces",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Covalent network solids consist of atoms connected by a continuous network of covalent bonds throughout the entire structure. Examples include diamond (carbon atoms) and quartz (silicon dioxide). These bonds are very strong, requiring a significant amount of energy to break, leading to very high melting points.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following has the highest melting point?",
      isMultipleChoice: true,
      a: "Na",
      b: "Mg",
      c: "K",
      d: "Ca",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Note that all of the above are metals, so we are considering metallic bonding. When it comes to metallic bonding, recall that whichever metal has the highest valence electron to radius ratio has the highest melting point. This is because more electrons and smaller sizes lead to stronger attractions between the metal atoms. Looking at our answer choices, we see that Mg would have the highest melting point since it has 2 valence electrons and a small size as it is in period 3.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following has the lowest melting point?",
      isMultipleChoice: true,
      a: "LiF",
      b: "MgF2",
      c: "MgCl2",
      d: "NaCl",
      correctMCQ: "d",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "When comparing ionic compounds for melting point, we must think of Coulomb's law, which states that lower charges and greater sizes lead to less attraction and thus lower melting point. Out of all the answer choices, D. NaCl has the lowest charges with Na+ and Cl- and a relatively large size when compared to LiF, which has elements with smaller atomic/ionic radius.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following substances has the highest boiling point?",
      isMultipleChoice: true,
      a: "CCl4",
      b: "CBr4",
      c: "CH4",
      d: "CF4",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Looking at all the following compounds, we will notice that all of the elements are non-polar molecules. Thus, the only intermolecular force holding these molecules together is the London dispersion force (LDF), and whichever molecule has the strongest LDF would have the highest boiling point. To determine which of the following molecules has the strongest LDF, we simply look at which of the molecules is the largest, which would be B.CBr4. The reasoning for this is that the largest molecules would have the most electrons, which makes the molecule able to have a stronger instantaneous dipole and thus a stronger attraction.",
      solutionImage: ""
    },
    {
      questionHeader: "When adding salts into a sample of water, which of the following properties of the sample decreases assuming temperature is constant? I. Boiling point II. Vapor pressure",
      isMultipleChoice: true,
      a: "Boiling point",
      b: "Vapor pressure",
      c: "Both boiling point and vapor pressure",
      d: "Neither boiling point nor vapor pressure",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider each of the following, one at a time. Firstly, boiling point does not decrease, rather, the addition of particles within the water makes it harder for the water to boil and thus increases the boiling point. We will explain this further after we consider II. Vapor pressure DOES decrease when salts are added into the water. This is according to Raoult’s Law, and also the fact that the concentrated particles of salt make it harder for water to escape into gas phase. For this reason, vapor pressure is decreased from adding salt. This can be used for explaining why boiling point decreases as boiling point is met when external pressure is equal to vapor pressure. Since vapor pressure at a specific temperature is decreased, we would need to raise the temperature more so that the vapor pressure is equal to the external pressure.",
      solutionImage: ""
    },
    {
      questionHeader: "A student is planning on combining a solution of 50. mL of 0.20 M of KNO3 with 50. mL of 0.30 M Mg(NO3)2. What is the new concentration of NO3- in the combined solution?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "0.40 M",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/IMF_and_Solutions_1.png"
    },
    {
      questionHeader: "Which of the following has the highest boiling point?",
      isMultipleChoice: true,
      a: "CH3OCH3",
      b: "NH3",
      c: "CH3CH2OH",
      d: "CH3CH2NH2",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "In order to solve this problem, we first draw out the lewis structure for each of the following compounds. Note that out of the 4 of them, A doesn't have any hydrogen bonds and thus have weaker IMFs. For this reason, the compound would have the smallest boiling point, so A is eliminated. Next, we look at the NH3. Although NH3 exhibits hydrogen bonds from the N-H bond, the size of NH3 being small compared to the other two compounds makes NH3 have a low boiling point since NH3 lacks a strong London dispersion force from its size. Thus, we compare C and D. Note that C has a stronger hydrogen bond. This is due to the fact that Oxygen is more electronegative that Nitrogen from having a stronger nuclear charge. For this reason, C has a stronger hydrogen bond and IMF, and thus C is our answer.",
      solutionImage: ""
    },
    {
      questionHeader: "It has been observed that there is a significant difference in the boiling points between ICl and Br2. Which of the following forces of attraction is responsible for this?",
      isMultipleChoice: true,
      a: "Hydrogen bonding",
      b: "Dipole-dipole interactions",
      c: "London dispersion forces",
      d: "Covalent bonding",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "When comparing ICl and Br2, first note that neither of the molecules exhibits hydrogen bonding since there are no hydrogens in either molecules, so that is out of the box. Next, we know that boiling points are correlated with the IMFs (which are molecule to molecule attraction) and not atom to atom covalent bonds, so covalent bonds are also out of the box. Finally, note ICl and Br2 have similar molar masses and thus have similar LDFs. For this reason, the difference in boiling point cannot be attributed to LDFs. Thus, our answer is B.dipole dipole attraction. This is due to the fact that ICl has a polar bond while Br2 is nonpolar.",
      solutionImage: ""
    },
    {
      questionHeader: "Consider a 3.0 mol liquid benzene at -5 degrees Celcius. The specific heat for liquid benzene is 135 J/molK and the boiling point of benzene is 5 degrees Celcius. If the heat of vaporization of benzene is 30.8 kJ/mol, find the amount of heat needed to turn this sample of liquid benzene into a gaseous sample of benzene in kJ.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/IMF_and_Solutions_2.png"
    }
  ],
  "Gases": [
    {
      questionHeader: "Inside of a sealed and rigid vessel contains Helium gas at 25 degrees Celsius. A student wants to double the pressure within the vessel by heating up the vessel. To what new temperature in Celsius must the student heat the vessel to?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "323",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Recall that by our gas laws, pressure and temperature in Kelvin are directly proportional. The original temperature in Kelvin was 273+25=298 K, and so to double our pressure, our new temperature must be 2*298= 596 K which is going to be 596-273=323 K.",
      solutionImage: ""
    },
    {
      questionHeader: "A gas occupies a rigid vessel with a pressure of 775 mm Hg and 5.0 L. If the gas is moving at a temperature of 23 degrees Celsius, find the number of moles of gas in the vessel.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "0.21 moles",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Gases_1.png"
    },
    {
      questionHeader: "Inside of a sealed vessel with a total pressure of 9.0 atm, there are 39 grams of N2, 42 grams of O2, and 5.0 grams of H2. Find the partial pressure of N2.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "2.4 atm",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Gases_2.png"
    },
    {
      questionHeader: "Some chlorine gas is currently occupying a container with a movable piston. The current volume is 5.0 L and the temperature is 0.0 degrees Celsius. If the volume is increased by 10. L and the container is heated to 28 degrees Celsius, what is the new pressure if the original pressure is 2.0 atm?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "0.74 atm",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Gases_3.png"
    },
    {
      questionHeader: "Consider two rigid vessels each containing some volume of the same liquid such that the volume of the vessels is 5 L and 10. L respectively. In the container with 5 L, the pressure is 8.0 atm while the other container has a pressure of 8.0 atm. Suppose the liquid from the 5 L vessel is carefully poured into the 10. L vessel, what is the new pressure inside of the 10. L vessel? Assume this occurs at a constant temperature.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "8.0 atm",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Note that this problem may seem like we must use gas law, this is actually not the case! Note that initially, the pressure in both vessels are caused by the liquid's vapor pressure (hint this is why both of their pressures are equal). And when we combine the liquid into the 10. L vessel, the vapor pressure is still the same since temperature is constant. Thus, the pressure is still 8.0 atm.",
      solutionImage: ""
    },
    {
      questionHeader: "Inside of a container that only contains ammonia gas, the pressure is 4.0 atm at a temperature of 300. K. Find the density of the ammonia gas in the container.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "2.8 g/L",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Gases_4.png"
    },
    {
      questionHeader: "Inside of a sealed container consists and CO2 and NO2 gases at 298 K. If the CO2 gas molecules has an average speed of 400.0 m/s, what is the average speed of the NO2 molecules?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "391.2 m/s",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Gases_5.png"
    },
    {
      questionHeader: "A student has 50.0 g of distilled water, and he measures that the current vapor pressure created by the distilled water is 2.2 atm. He then adds 12.0 g of Li2O into the distilled water. What is the vapor pressure of the resulting solution?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "1.9 atm",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Gases_6.png"
    }
  ],
  "Thermodynamics": [
    {
      questionHeader: "A sample of 54.0 g of methanol is heated from 25.0 °C to 35.0 °C. How much heat is required? The specific heat capacity of methanol is 2.48 J g–1 K –1.",
      isMultipleChoice: true,
      a: "0.00459 J",
      b: "0.0747 J",
      c: "1340 J",
      d: "4690 J",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Thermodynamics_1.png"
    },
    {
      questionHeader: "Given the standard enthalpy changes for the reactions: F2(l) + H2 (g)  -> 2HF(aq) ΔHº =H1 –1 H2(g) + 1/2O2(g)  -> H2O(aq) ΔHº = H_2–2 Calculate the standard enthalpy change ∆Hº for the following reaction: F2(g) + H2O -> 2HF + 1/2O2.",
      isMultipleChoice: true,
      a: "H1 + H2",
      b: "H1-H2",
      c: "H2-H1",
      d: "Not enough information",
      correctMCQ: "d",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Initially, it may seem tempting to use Hess’ law or the enthalpy of formation formula on this problem. However, note that our initial given reaction has fluorine as a LIQUID and not a gas. This makes us unable to use either techniques, so our answer is D.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following reaction’s change in enthalpy represents the heat of formation of C2H6O(s)?",
      isMultipleChoice: true,
      a: "2C(g) + 3H2(g) + 1/2O2(g) -> C2H6O(s)",
      b: "2C(s, graphite) + 3H2(g) + 1/2O2(g) -> C2H6O(s)",
      c: "4C(s, graphite) + 6H2(g) + O2(g) -> 2C2H6O(s)",
      d: "C2H6O(s) -> 2C(s,graphite) + 3H2(g) + 1/2O2(g)",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, the heat of formation is the reaction of forming ONE mole of the compound from its elements at standard states. At standard states, Carbon is in its solid graphite state and Hydrogen and Oxygen are in the gaseous state. Thus, the reaction should look as identical to the one shown in B for our answer.",
      solutionImage: ""
    },
    {
      questionHeader: "Consider the reaction H2 + F2 -> 2HF. Which of the following statements is correct?",
      isMultipleChoice: true,
      a: "This is an exothermic reaction because the amount of energy released by the H-F bonds are greater than the amount of energy absorbed by the H-H and F-F bond",
      b: "This is an endothermic reaction because the amount of energy released by the H-F bonds are less than the amount of energy absorbed by the H-H and F-F bond",
      c: "This is an exothermic reaction because two different compounds are turned into one distinct compound.",
      d: "This is an endothermic reaction because two different compounds are turned into one distinct compound.",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Note that since this is a synthesis reaction, the reaction is most likely an exothermic reaction. This is further proven by the fact that the product HF has a strong bond than H-H and F-F and thus releases more energy. This is because the H-F is a polar bond and thus releases more energy than the energy absorbed from breaking the nonpolar bonds of H-H and F-F. Thus, our answer is A.",
      solutionImage: ""
    },
    {
      questionHeader: "When considering a reaction that must be thermodynamically favorable at all temperatures, which of the following shows the sign of change in enthalpy (first one) and change in entropy (second one) correctly?",
      isMultipleChoice: true,
      a: "-, -",
      b: "+, -",
      c: "+, +",
      d: "-, +",
      correctMCQ: "d",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Thermodynamics_2.png"
    },
    {
      questionHeader: "What is the final temperature when 20.0 g of water (specific heat capacity 4.184 J•g–1 •K–1 ) at 80.0 ˚C is mixed with 30.0 g of water at 20.0 ˚C in an insulated container? USNCO 2012 Local Exam",
      isMultipleChoice: true,
      a: "32 ˚C",
      b: "44 ˚C",
      c: "50 ˚C",
      d: "56 ˚C",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "First, note that the heat gained by the cold water is equal to the heat lost by the hot water via conservation of energy. Thus, we have -(20.0)(T-80)(4.184) = (30.0)(T-20)(4.184) where T is the final temperature of the system. Solving gives us T= 44 and our answer is B.",
      solutionImage: ""
    }
  ],
  "Kinetics": [
    {
      questionHeader: "If elemental bromine is being formed according to the equation below at a rate of 0.056 M s –1 , at what rate is bromide ion being consumed? 5 Br– (aq) + BrO3 – (aq) + 6 H+ (aq) -> 3 Br2(aq) + 3 H2O(l) USNCo Local Exam 2017",
      isMultipleChoice: true,
      a: "0.019 M s–1",
      b: "0.034 M s–1",
      c: "0.056 M s–1",
      d: "0.093 M s–1",
      correctMCQ: "d",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Kinetics_1.png"
    },
    {
      questionHeader: "Consider a reaction that consists of gases within a vessel. Which of the following would NOT increase the rate of the reaction?",
      isMultipleChoice: true,
      a: "Decreasing the volume of the vessel",
      b: "Increasing the temperature",
      c: "Adding Ne gas into the vessel while maintaining constant volume",
      d: "Increasing the amount of reactant gases within the vessel while maintaining constant volume",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s use collision theory to solve this problem. Note that A, B, D all increase the reaction speed since it increases the amount of particle collisions between the reactants gases and thus increase the frequency of successful collisions. However, C doesn’t since it’s a noble gas and thus has no effect on the pressure on the reactant gases and thus doesn’t impact the speed of the reaction.",
      solutionImage: ""
    },
    {
      questionHeader: "The gas phase decomposition of dinitrogen pentoxide is represented by this equation. 2N2O5(g) -> 4NO2(g) + O2(g). What is the rate of formation of oxygen gas (in mol•L –1 •s –1 ) in an experiment where 0.080 mol of N2O5 is consumed in a 4.0 L container every 0.20 seconds?",
      isMultipleChoice: true,
      a: "0.020",
      b: "0.050",
      c: "0.10",
      d: "0.20",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "From the reaction, we see that for every two N2O5 consumed, one O2 is produced. Thus we can calculate the rate of consumption of N2O5 and then use a ratio from the reaction. 0.080 mol N2O5 4.0 L × 0.20 s × 1 mol O2/ 2 mol N2O5 = 0.050 M s−1 Thus, the answer is B.",
      solutionImage: ""
    },
    {
      questionHeader: "How many of the following statements are true about the use of catalysts: It changes the reaction mechanism of a reaction. The overall activation energy is lowered. It changes the overall change in enthalpy of the overall reaction.",
      isMultipleChoice: true,
      a: "0",
      b: "1",
      c: "2",
      d: "3",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider each statement at a time. The first statement is correct since it is through changing the reaction mechanism that causes the reaction to go faster from the catalyst. The catalyst lowers the activation energy of the activation complex, making the reaction faster. The following explanation also explains why statement 2 is true. However, statement 3 is false as recall that the rate of the reaction doesn't affect the change in enthalpy. Our answer is therefore C.2.",
      solutionImage: ""
    },
    {
      questionHeader: "The rate constant for a reaction is 4.9 * 10^-3 1/s*M^2. Find the overall reaction order of the reaction.",
      isMultipleChoice: true,
      a: "Not enough info",
      b: "1",
      c: "2",
      d: "3",
      correctMCQ: "d",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Kinetics_2.png"
    },
    {
      questionHeader: "Given the reaction mechanism as shown below for the overall reaction A+2B-> D. By what factor does the rate of the reaction change when the initial concentration of [A] and [B] is increased by a factor 4 and 3 respectively?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "36",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Kinetics_3.png"
    },
    {
      questionHeader: "Consider the following reaction mechanism where A,B,C,D have unknown states: A <-> B, B+C -> D. Which of the following values MUST change if there is an increase in the amount A in the system?",
      isMultipleChoice: true,
      a: "The equilibrium constant of the overall reaction, K",
      b: "The equilibrium quotient of the overall reaction, Q",
      c: "The rate of the overall reaction",
      d: "The standard change of enthalpy per mole of the overall reaction",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider each of the answer choices first. K does not change when [A] changes since K is only dependent on temperature. Similarly, D is incorrect since the change in enthalpy is temperature dependent and increasing the amount of A doesn’t change the reaction release of energy from 1 mol of reaction. Furthermore, B is also not correct as A may be a solid in the reaction, and so changing A may not affect the reaction. Thus, that leaves C our correct answer. The following is a proof that the rate of the reaction is first order with respect to [A] no matter which step is the slow step. If the first step is the slow step, then the rate of the reaction is equal to k[A]. If the second step is the slow step, then the rate of the reaction is equal to k[B][C] = k[A][C] by steady state approximation. Thus, increasing [A] increases the rate of reaction.",
      solutionImage: ""
    },
    {
      questionHeader: "Given the half life of a frictional element undergoing alpha decay is 48 years. How long would it take for this element to decay to 45% of its original amount? Give your answer to the nearest year? Assume this half life reaction is first order.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "55",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Kinetics_4.png"
    },
    {
      questionHeader: "A reaction with A-> Products has a second order with respect to [A]. If the initial concentration of [A] = 0.55 M, the half life of the reaction is 580 s. Find the rate constant of the reaction.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "3.1*10^-3 1/s*M",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Kinetics_5.png"
    }
  ],
  "Chemical Equilibrium": [
    {
      questionHeader: "How many of the following statements are true? I. Equilibrium is obtained when the reverse reaction rate is equal to the forward reaction rate. II. For every chemical reaction, the equilibrium constant is dependent on the concentration of every single compound within the reaction. III. The equilibrium constant is dependent on the temperature of the system.",
      isMultipleChoice: true,
      a: "0",
      b: "1",
      c: "2",
      d: "3",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let's consider each statement at a time. Statement I is true since that is the definition of dynamic equilibrium: when the forward and reverse reaction rate are equal so that the concentration of the species in the reaction no longer changes. Statement II is false since the constant depends ONLY on the concentration of aqueous and gaseous substances. Finally, K is indeed dependent on temperature according to Le Chatelier's principle. So C.2.",
      solutionImage: ""
    },
    {
      questionHeader: "Consider the endothermic reaction 2C(s) + 2H2O(g) -> CH4(g) + CO2(g). Currently, the system is at equilibrium, doing which of the following increases the moles of CO2?",
      isMultipleChoice: true,
      a: "Decreasing the temperature",
      b: "Increasing C(s)",
      c: "Decreasing the volume",
      d: "Decreasing the amount of CH4(g)",
      correctMCQ: "d",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider each answer choice at a time. Decreasing the temperature would shift the reaction left since the reaction is endothermic, so A is incorrect. Since C(s) is not aqueous or gaseous, increasing this amount doesn’t affect the system. Decreasing volume also doesn’t have an effect since both sides of the reaction have 2 moles of gas, so volume cancels out in Qc. Finally, D is correct since decreasing CH4(g) shifts the reaction right and increases CO2(g).",
      solutionImage: ""
    },
    {
      questionHeader: "Consider a frictional reaction A(g) + B(g) -> C(g). When the temperature is 39 degrees Celsius, Kc is equal to 6.8x10^4. Find Kp at this same temperature.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "2600",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Chemical_equilibrium_1.png"
    },
    {
      questionHeader: "Consider the following reaction HC2H3O2 + NH3 -> NH4+ + C2H3O2-. The Kc for this reaction is 3.24*10^-10. What is the Kc for 1/2HC2H3O2 + 1/2NH3 -> 1/2NH4+ + 1/2C2H3O2-?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "1.8*10^-5",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Chemical_equilibrium_2.png"
    },
    {
      questionHeader: "Consider a mythical gas reaction with Kp = 20.4 at 298 K. A(g) + B(g) <-> 2 AB(g). A sealed vessel of 2.0 L initially had 0.020 mol of both A and B respectively. After equilibrium is reached, how many moles of AB are there?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Chemical_equilibrium_3.png"
    },
    {
      questionHeader: "Consider 2 mythical elements A and B. The vapor pressure of A(l) is 0.708 atm while the vapor pressure of B(l) is 0.503 atm at 298K. Given those two values, find the Kc of A(l) + B(l) -> A(g) + B(g).",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "5.96*10^-4",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Chemical_equilibrium_4.png"
    },
    {
      questionHeader: "A student wants to find the change in standard enthalpy of a reaction and plans on plotting a graph to find it. Which of the following graphs should the student use? I. lnK vs 1/T II. Change in free Gibbs energy vs T",
      isMultipleChoice: true,
      a: "I only",
      b: "II only",
      c: "Both I and II",
      d: "Neither I or II",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Chemical_equilibrium_5.png"
    }
  ],
  "Equilibrium Solubility": [
    {
      questionHeader: "What is the solubility in pure water of Ba(IO3)2 in moles per liter at 25 ˚C? [Ksp (25 ˚C) = 6.0 10–10] USNCO 2012 Local Exam",
      isMultipleChoice: true,
      a: "1.2 10–5",
      b: "1.7 10–5",
      c: "5.3 10–4",
      d: "8.4 10–4",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Equilibrium_Solubility_1.png"
    },
    {
      questionHeader: "The compound BaSO3 dissolves in neutral water with a solubility of 194 mg/L. Find the Ksp of BaSO3 at the same temperature.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Equilibrium_solubility_2.png"
    },
    {
      questionHeader: "A student currently has 0.40 M of KCl in a solution of 2.0 L. If the Ksp of PbCl2 is 1.8*10^-5, how many grams of Pb(NO3)2 must the student add to the solution to form a precipitate?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "0.075 g",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Equilibrium_solubility_3.png"
    },
    {
      questionHeader: "What is the pH of a saturated solution of Co(OH)2? The Ksp of Co(OH)2 is 5.9*10–15 USNCO 2018 National Exam.",
      isMultipleChoice: true,
      a: "7.19",
      b: "9.06",
      c: "9.36",
      d: "9.56",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, we have Ksp = [OH−] ^2 × [Co2+] = 5.9 × 10−15 Suppose the concentration of cobalt ions is x, (2x) ^2 × x = 5.9 × 10−15 -> x = 1.14 × 10−5 [OH−] = 2x = 2.28 × 10−5 M-> pH = 14 + log [OH−] = 9.36 The answer is therefore C.",
      solutionImage: ""
    },
    {
      questionHeader: "What is the concentration of a solution of [Mg2+] if the Ksp of Mg(OH)2 is 5.61*10^-12 and the pOH is 9.810?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "2.34 x 10^8",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Equilibrium_solubility_4.png"
    },
    {
      questionHeader: "A student has 1.0 M solutions of the following list of compounds to which he can add PbF2 into the solutions. How many of the following solutions would result in the molar solubility of PbF2 being greater than that of PbF2 in neutral water? KHCO3, AlCl3, NaHSO4.",
      isMultipleChoice: true,
      a: "0",
      b: "1",
      c: "2",
      d: "3",
      correctMCQ: "d",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider each compound one by one. Note that in KHCO3, when dissolved, the HCO3- is a weak base. This causes an excess amount of hydroxide ions within the solution. Thus, for this reason, when adding PbF2, the lead(II) ions would react with the hydroxide ions to form lead (II) hydroxide. This causes the less Pb2+ ions in the solution and shifts the reaction of PbF2 <-> Pb2+ + 2F- to the right, increasing the molar solubility. Next, as for AlCl3 and NaHSO4, both solutions create an excess of hydronium ions. For AlCl3, the Aluminum cation undergoes salt hydrolysis to form Aluminum hydroxide, thus decreasing the pH. Similarly, the HSO4- from NaHSO4 partially dissociates into H+ and SO4^2-. Thus, this causes the fluoride ions in PbF2 to form HF with the excess hydrogen cations. Thus, also shifting the PbF2 <-> Pb2+ + 2F- to the right and increasing molar solubility, so our answer is D.3.",
      solutionImage: ""
    }
  ],
  "Acid and Base": [
    {
      questionHeader: "Which of the following would NOT fully dissociate in water?",
      isMultipleChoice: true,
      a: "HI",
      b: "HClO2",
      c: "H2SO4",
      d: "HNO3",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Note that out of the four options, HI, H2SO4, and HNO3 are all strong acids and thus would fully dissociate in water. Thus, our answer is B.",
      solutionImage: ""
    },
    {
      questionHeader: "When comparing the strength of binary acids, which of the following should be taken into consideration? I. Atomic radius of the non-hydrogen element II. Nuclear effective charge of the non-hydrogen element",
      isMultipleChoice: true,
      a: "I",
      b: "II",
      c: "I and II",
      d: "Neither I or II",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let's consider both statements at once. When considering the strength of binary acids, we must consider how easily the hydrogen ion would come off of the non hydrogen element. If the atomic radius of the non hydrogen element is larger, this makes it easier for the hydrogen ion to come off due to less attraction. If the non hydrogen element has a greater nuclear effective charge, this means the partial positive charge on the hydrogen would be greater since the electron on the hydrogen would be pulled more toward the non hydrogen and thus the hydrogen ion would also come off more easily. This is because the oxygen from the water molecules would be able to pull the hydrogen from the acid easily. Thus, the answer is C.Both.",
      solutionImage: ""
    },
    {
      questionHeader: "At room temperature, we know pH + pOH = 14. However, at some other temperature, it is found that the sum of pH and pOH is equal to 15.20. What is the concentration of [H+] in neutral water then?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "2.5*10^-8 M",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "By definition, for neutral water, pH = pOH since there is no excess acid or base in neutral water. Thus, 2pH = 15.20, and we have [H+] = 10^-7.60 = 2.5*10^-8 M.",
      solutionImage: ""
    },
    {
      questionHeader: "Which of the following does NOT act as both a Bronsted Lowry acid and base?",
      isMultipleChoice: true,
      a: "HCO3^-",
      b: "HSO4^-",
      c: "H2PO3-",
      d: "H2O",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Recall that by definition, a compound that acts as both an acid and base must be able to donate both a H+ AND receive H+. Let’s look at each of the answer choices: HCO3^2- : H2CO3 and CO3^2-. HSO4^- : HSO4^- doesn’t do the job. This is because H2SO4 is a strong acid and fully dissociates, thus HSO4- cannot form H2SO4 or receive H+ ions. Thus, our answer is B. We will check the rest H2PO3- : H3PO3, HPO3^2- H2O: H3O+ OH-.",
      solutionImage: ""
    },
    {
      questionHeader: "A student mixes 40. mL of 0.25 M of HCl with 40. mL of 0.40 M of NaOH. What is the new pH of the solution?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "12.88",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Acid_and_Base_1.png"
    },
    {
      questionHeader: "The Ka of NH4+ is 1.80*10^-5. Find the pH of 0.35 M solution of NH4NO3.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "2.60",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Acid_and_Base_2.png"
    },
    {
      questionHeader: "Which of the following Bronsted Lowry bases would have the highest Kb value?",
      isMultipleChoice: true,
      a: "BrO-",
      b: "BrO2-",
      c: "ClO-",
      d: "ClO2-",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Acid_and_Base_3.png"
    },
    {
      questionHeader: "Which of the following solutions would have the lowest pH? 1.0 M of NaNO3, 1.0 M of Al(NO3)3, 1.0 M of NaF, 1.0 M of AlF3.",
      isMultipleChoice: true,
      a: "1.0 M of NaNO3",
      b: "1.0 M of Al(NO3)3",
      c: "1.0 M of NaF",
      d: "1.0 M of AlF3",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider each of the following options one at a time. For A, the pH would be 7 since both Na+ and NO3- are pH neutral ions (this is because NaOH is a strong base and HNO3 is a strong acid). Next, we know that Al(NO3)3 would have a pH less than 7. This is due to the fact that Al3+ undergoes salt hydrolysis according to the following reaction: Al3+ + 3H2O -> 3H+ + Al(OH)3, and thus forms excess H+ ions and thus lowers the pH. Next, we know that NaF has a pH greater than 7 since NaF undergoes salt hydrolysis with F- forming HF and excess hydroxide ions, thus making the solution basic. Finally, we have AlF3. Note that both Al3+ and F- would undergo salt hydrolysis. Al3+ would lower the pH while F- raises the pH as explained for option B and C. Since F- raises the pH, this makes Al(NO3)3 have a lower pH as NO3- doesn’t raise the pH. Therefore, our answer is B.",
      solutionImage: ""
    },
    {
      questionHeader: "Consider a solution with 0.50 M of NaIO and 0.25 M of HIO. If the Ka of HIO is 2.0*10^-11, what is the pH of the solution?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "8.50",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Acid_and_Base_4.png"
    },
    {
      questionHeader: "A student deposits 49.3 g of Calcium oxide into 4.0 L of water, and he then measures the pH of the solution. What is the pH of the solution? Assume the volume of the water doesn’t change.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "13.64",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Acid_and_Base_5.png"
    }
  ],
  "Application of Thermodynamics (Electrochem)": [
    {
      questionHeader: "Consider the unbalanced redox reaction in a basic solution: Cr2O7^2- + SO3^2- -> Cr^3+ + SO4^2-. Find the coefficient of H2O in the balanced reaction.",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "4",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Application_of_Thermodynamics_1.png"
    },
    {
      questionHeader: "A sample of molten KBr is being used to conduct electrolysis, how many of the following statements are true? I. Potassium cations are being reduced at the anode II. Bromine anions are being oxidized at the anode III. Solid deposits are being formed at the cathode",
      isMultipleChoice: true,
      a: "0",
      b: "1",
      c: "2",
      d: "3",
      correctMCQ: "c",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let's consider each statement at a time. Statement I is incorrect since oxidization happens at the anode and not reduction. Statement II is correct since bromide ions are losing electrons and therefore being oxidized at the anode (Br- to Br). Finally, statement III is correct as potassium cations are being reduced into potassium metals, which is a solid metal at the cathode (since this is reduction). So C. Note that if this were to occur in water instead of molten, the answers would've been different.",
      solutionImage: ""
    },
    {
      questionHeader: "Consider the following voltaic cell represented by the cell notation Zn(s) | Zn2+(aq) || Cu2+(aq) | Cu(s). Which of the following statements are true? (A) As the reaction occurs, the Zn2+ concentration increases (B) Increasing the size of the Cu electrode affects the voltage (C) Over time, the cell voltage does not decrease to 0 V (D) The cell with the Copper ions is the anode.",
      isMultipleChoice: true,
      a: "As the reaction occurs, the Zn2+ concentration increases",
      b: "Increasing the size of the Cu electrode affects the voltage",
      c: "Over time, the cell voltage does not decrease to 0 V",
      d: "The cell with the Copper ions is the anode",
      correctMCQ: "a",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "Let’s consider each statement one at a time. We first note that from the cell notation, Zn is being oxidized into Zn2+ and Cu2+ is being reduced into Cu. Thus, as the reaction occurs, Zn2+ concentration does increase, so A is correct, but let’s check the rest of the choices. Increasing the size of electrode doesn’t affect the voltage as the electrode isn’t part of the reaction. C is incorrect since cell voltage is 0 at equilibrium. Finally, we know D is incorrect since Cu2+ is being reduced and so must be at the cathode.",
      solutionImage: ""
    },
    {
      questionHeader: "Consider a current of 20.00 A flowing through a solution of Aluminum acetate. A student wants to collect 5.40 g of Al metal. How many seconds must the student wait?",
      isMultipleChoice: false,
      a: "",
      b: "",
      c: "",
      d: "",
      correctMCQ: "",
      openAnswer: "2900",
      hasSolution: true,
      hasSolutionImage: true,
      solutionText: "",
      solutionImage: "/solutions/Application_of_Thermodynamics_2.png"
    },
    {
      questionHeader: "Conducting electrolysis in which of the solutions would cause phenolphthalein to turn pink? I. 1.0 M of NaNO3 II. 1.0 M of KI",
      isMultipleChoice: true,
      a: "I only",
      b: "II only",
      c: "Both I and II",
      d: "Neither I or II",
      correctMCQ: "b",
      openAnswer: "",
      hasSolution: true,
      hasSolutionImage: false,
      solutionText: "First, we must recognize that phenolphthalein only turns pink if the solution is basic. Let's examine each of the redox reactions. First off the bat, we know that II would turn the solution pink since water would get reduced as potassium is a group 1 metal while iodide gets oxidized. The reduction of water follows the following reaction: 2H2O + 2e- -> H2 + 2OH-. This produces hydroxide ions and thus the solution is basic. Next, we consider I. This may seem like this would also be a basic solution since sodium is also a group 1 metal. However, polyatomic ions tend to not be oxidized. Therefore, water is being oxidized AND reduced. For this reason, while hydroxide ions are produced from the reduction of water, hydronium ions are also produced from the oxidation of water, and so the overall solution is neutral. Thus, our answer is B.",
      solutionImage: ""
    }
  ],
  
    // Add other topics similarly with multiple questions
  };
  
    const [modalIsOpen, setIsOpen] = useState(false);
    const [activeTopic, setActiveTopic] = useState('');
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showSolution, setShowSolution] = useState(false);
    const [usedQuestions, setUsedQuestions] = useState({});
  
    const getNextQuestion = (topic) => {
      let usedQuestionsForTopic = usedQuestions[topic] || [];
  
      if (usedQuestionsForTopic.length === questionTopics[topic].length) {
        // All questions used, reset
        usedQuestionsForTopic = [];
      }
  
      const remainingQuestions = questionTopics[topic].filter(
        (q, index) => !usedQuestionsForTopic.includes(index)
      );
  
      const randomQuestionIndex = Math.floor(Math.random() * remainingQuestions.length);
      const randomQuestion = remainingQuestions[randomQuestionIndex];
  
      usedQuestionsForTopic.push(questionTopics[topic].indexOf(randomQuestion));
  
      setUsedQuestions({
        ...usedQuestions,
        [topic]: usedQuestionsForTopic
      });
  
      setActiveQuestion(randomQuestion);
      setShowAnswer(false);
      setShowSolution(false);
    };
  
    const openModal = (topic) => {
      setActiveTopic(topic);
      getNextQuestion(topic);
      setIsOpen(true);
    };
  
    const closeModal = () => {
      setIsOpen(false);
      setActiveTopic('');
      setActiveQuestion(null);
      setShowAnswer(false);
      setShowSolution(false);
    };
  
    return (
      <div className="App">
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"/>
        <Navigation />
        <div className="button-container">
          {Object.keys(questionTopics).map((topic, index) => (
            <button
              key={index}
              id={`button-${index}`}
              className={`question-buttons`}
              onClick={() => openModal(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Example Popup"
          className="Modal"
          overlayClassName="Overlay"
        >
          {activeQuestion && (
            <>
              <h2>{activeQuestion.questionHeader}</h2>
              {activeQuestion.isMultipleChoice ? (
                <div>
                  <p>A. {activeQuestion.a}</p>
                  <p>B. {activeQuestion.b}</p>
                  <p>C. {activeQuestion.c}</p>
                  <p>D. {activeQuestion.d}</p>
                </div>
              ) : (
                <p></p>
              )}
              <button onClick={() => setShowAnswer(!showAnswer)}>
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </button>
              {showAnswer && (
                <div>
                  {activeQuestion.isMultipleChoice ? (
                    <p>Correct Answer: {activeQuestion[`correctMCQ`]}</p>
                  ) : (
                    <p>Correct Answer: {activeQuestion.openAnswer}</p>
                  )}
                </div>
              )}
              {activeQuestion.hasSolution && (
                <div>
                  <button onClick={() => setShowSolution(!showSolution)}>
                    {showSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>
                  {showSolution && (
                    <div>
                      <p>{activeQuestion.solutionText}</p>
                      {activeQuestion.hasSolutionImage && (
                        <div className="image-container">
                          <img src={activeQuestion.solutionImage} alt="Solution" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <button onClick={() => getNextQuestion(activeTopic)}>Next Question</button>
            </>
          )}
          <button onClick={closeModal}>Close</button>
        </Modal>
        <Footer/>
      </div>
    );
  };
  
  export default Questions;