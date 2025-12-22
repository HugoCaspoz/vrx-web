
export type EuroCarData = {
    [make: string]: {
        models: {
            [family: string]: {
                [generation: string]: {
                    diesel?: string[];
                    gas?: string[];
                    hybrid?: string[];
                    electric?: string[];
                } | string[] // Allow backward compat or simple lists if needed, but we will aim for objects
            }
        }
    }
};

export const EURO_CARS = {
    "BMW": {
        models: {
            "Serie 1": {
                "E81/E82/E87/E88 (2004-2013)": {
                    diesel: ["116d", "118d", "120d", "123d"],
                    gas: ["116i", "118i", "120i", "125i", "130i", "135i", "1M"]
                },
                "F20/F21 (2011-2019)": {
                    diesel: ["114d", "116d", "118d", "120d", "125d"],
                    gas: ["114i", "116i", "118i", "120i", "125i", "M135i", "M140i"]
                },
                "F40 (2019-Presente)": {
                    diesel: ["116d", "118d", "120d"],
                    gas: ["118i", "120i", "128ti", "M135i"]
                }
            },
            "Serie 2": {
                "F22/F23 (2014-2021)": {
                    diesel: ["218d", "220d", "225d"],
                    gas: ["218i", "220i", "228i", "230i", "M235i", "M240i", "M2", "M2 Competition", "M2 CS"]
                },
                "G42 (2021-Presente)": {
                    diesel: ["220d"],
                    gas: ["220i", "230i", "M240i", "M2"]
                }
            },
            "Serie 3": {
                "E36 (1990-2000)": {
                    diesel: ["318tds", "325td", "325tds"],
                    gas: ["316i", "318i", "318is", "320i", "323i", "325i", "328i", "M3"]
                },
                "E46 (1998-2006)": {
                    diesel: ["318d", "320d", "330d"],
                    gas: ["316i", "318i", "318ci", "320i", "320ci", "323i", "325i", "328i", "330i", "330ci", "M3", "M3 CSL"]
                },
                "E90/E91/E92/E93 (2005-2013)": {
                    diesel: ["316d", "318d", "320d", "325d", "330d", "335d"],
                    gas: ["316i", "318i", "320i", "325i", "330i", "335i", "M3"]
                },
                "F30/F31/F34 (2012-2019)": {
                    diesel: ["316d", "318d", "320d", "325d", "330d", "335d"],
                    gas: ["316i", "318i", "320i", "328i", "330i", "335i", "340i", "M3"]
                },
                "G20/G21 (2019-Presente)": {
                    diesel: ["316d", "318d", "320d", "330d", "M340d"],
                    gas: ["318i", "320i", "330i", "M340i", "M3", "M3 Competition"]
                }
            },
            "Serie 4": {
                "F32/F33/F36 (2013-2020)": {
                    diesel: ["418d", "420d", "425d", "430d", "435d"],
                    gas: ["420i", "428i", "430i", "435i", "440i", "M4", "M4 CS", "M4 GTS"]
                },
                "G22/G23/G26 (2020-Presente)": {
                    diesel: ["420d", "430d", "M440d"],
                    gas: ["420i", "430i", "M440i", "M4", "M4 Competition"]
                }
            },
            "Serie 5": {
                "E39 (1995-2003)": {
                    diesel: ["520d", "525d", "530d"],
                    gas: ["520i", "523i", "525i", "528i", "530i", "535i", "540i", "M5"]
                },
                "E60/E61 (2003-2010)": {
                    diesel: ["520d", "525d", "530d", "535d"],
                    gas: ["520i", "523i", "525i", "530i", "540i", "545i", "550i", "M5"]
                },
                "F10/F11 (2010-2017)": {
                    diesel: ["518d", "520d", "525d", "530d", "535d", "M550d"],
                    gas: ["520i", "523i", "528i", "530i", "535i", "550i", "M5"]
                },
                "G30/G31 (2017-Presente)": {
                    diesel: ["518d", "520d", "530d", "540d", "M550d"],
                    gas: ["520i", "530i", "540i", "M550i", "M5"]
                }
            },
            "Serie X": {
                "X1 (E84, F48, U11)": {
                    diesel: ["16d", "18d", "20d", "23d", "25d"],
                    gas: ["18i", "20i", "25i", "28i", "35i"]
                },
                 "X3 (E83, F25, G01)": {
                    diesel: ["18d", "20d", "30d", "35d", "M40d"],
                    gas: ["20i", "25i", "28i", "30i", "35i", "M40i", "X3 M"]
                },
                "X5 (E53, E70, F15, G05)": {
                    diesel: ["3.0d", "30d", "35d", "40d", "50d", "M50d"],
                    gas: ["3.0i", "35i", "40i", "4.4i", "4.6is", "4.8is", "50i", "M50i", "X5 M"]
                },
                "X6 (E71, F16, G06)": {
                    diesel: ["30d", "35d", "40d", "50d", "M50d"],
                    gas: ["35i", "40i", "50i", "X6 M"]
                }
            },
            "Z": {
               "Z3": { gas: ["1.8", "1.9", "2.0", "2.2", "2.8", "3.0", "M 3.2"] },
               "Z4 E85": { gas: ["2.0i", "2.2i", "2.5i", "3.0i", "M 3.2"] },
               "Z4 E89": { gas: ["sDrive18i", "sDrive20i", "sDrive23i", "sDrive28i", "sDrive30i", "sDrive35i", "sDrive35is"] },
               "Z4 G29": { gas: ["sDrive20i", "sDrive30i", "M40i"] }
            }
        }
    },
    // ... Simplified Logic for brevity in this artifact, assume User wants full list update? 
    // The user ONLY complained about BMW and Fuel Selector. I will map BMW extensively.
    // I will keep the others as flat arrays for now if I don't have time to map all,
    // OR I will map them quickly. For consistency, let's map what we had.
    
    "Audi": {
        models: {
            "A3 / S3 / RS3": {
                "8P (2003-2012)": {
                    diesel: ["1.6 TDI", "1.9 TDI", "2.0 TDI (140/170)"],
                    gas: ["1.6 FSI", "2.0 FSI", "1.8 TFSI", "2.0 TFSI", "3.2 V6", "S3", "RS3"]
                },
                "8V (2012-2020)": {
                    diesel: ["1.6 TDI", "2.0 TDI (150/184)"],
                    gas: ["1.0 TFSI", "1.2 TFSI", "1.4 TFSI", "1.8 TFSI", "2.0 TFSI", "S3", "RS3"]
                }
            },
             "A4 / S4 / RS4": {
                "B6/B7 (2001-2008)": {
                    diesel: ["1.9 TDI", "2.0 TDI", "2.5 TDI", "3.0 TDI"],
                    gas: ["1.8T", "2.0 TFSI", "3.0 V6", "3.2 FSI", "4.2 V8 (S4)", "RS4 (B7)"]
                },
                "B8 (2008-2016)": {
                    diesel: ["2.0 TDI", "2.7 TDI", "3.0 TDI"],
                    gas: ["1.8 TFSI", "2.0 TFSI", "3.0 TFSI", "S4 3.0T", "RS4"]
                }
            }
        }
    },
    "Volkswagen": {
         models: {
             "Golf / GTI / R": {
                 "Mk5": {
                     diesel: ["1.9 TDI", "2.0 TDI (140/170)"],
                     gas: ["1.4 TSI", "2.0 TFSI (GTI)", "R32"]
                 },
                 "Mk6": {
                     diesel: ["1.6 TDI", "2.0 TDI (110/140/170)"],
                     gas: ["1.4 TSI", "2.0 TSI (GTI)", "Golf R (2.0T)"]
                 },
                 "Mk7/7.5": {
                     diesel: ["1.6 TDI", "2.0 TDI (150/184)"],
                     gas: ["1.2 TSI", "1.4 TSI", "2.0 TSI (GTI)", "Golf R", "Clubpsort"]
                 }
             }
         }
    },
    "Mercedes-Benz": {
        models: {
           "Clase C": {
               "W204 (2007-2014)": {
                   diesel: ["C200 CDI", "C220 CDI", "C250 CDI", "C320/350 CDI"],
                   gas: ["C180K", "C200K", "C250", "C300", "C350", "C63 AMG"]
               },
               "W205 (2014-2021)": {
                   diesel: ["C220d", "C250d", "C300d"],
                   gas: ["C180", "C200", "C250", "C300", "C43 AMG", "C63/S AMG"]
               }
           }
        }
    },
    "SEAT / CUPRA": {
         models: {
             "Leon": {
                 "Mk2 (1P)": {
                     diesel: ["1.9 TDI", "2.0 TDI (140/170)"],
                     gas: ["2.0 TFSI (FR/Cupra)", "Cupra R"]
                 },
                 "Mk3 (5F)": {
                     diesel: ["1.6 TDI", "2.0 TDI (150/184)"],
                     gas: ["1.4 TSI", "1.8 TSI", "2.0 TSI (Cupra 265/280/290/300)"]
                 }
             }
         }
    }
} as const;
