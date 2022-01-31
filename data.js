schema = [
    {
        type: "SUBJ",
        fullname: "Natuurkunde",
        shortname: "Na.",
        assignments: [
            {
                type: "COMB",
                weight: 1,
                assignments: [
                    {
                        type: "PO",
                        year: 5,
                        period: 1,
                        description: "Verslaglegging (individueel of in tweetallen) van een experiment rondom een periodiek verschijnsel",
                        domains: ["A", "I1"],
                        weight: .5
                    },
                    {
                        type: "MET",
                        year: 5,
                        period: 1,
                        description: "Engelstalige presentatie in groepsverband over een aan klimaatverandering en duurzaamheid gerelateerd mondiaal probleem",
                        domains: ["A", "G2"],
                        weight: .5
                    }
                ]
            },
            {
                type: "SET",
                year: 5,
                period: 2,
                description: "Toets over periodieke verschijnselen, biofysica, materiaaleigenschappen en medische beeldvorming",
                domains: ["A", "B1", "B2", "E1", "G1"],
                weight: 1
            },
            {
                type: "COMB",
                weight: 1,
                assignments: [
                    {
                        type: "PO",
                        year: 5,
                        period: 3,
                        description: "Technisch ontwerp van een robot opstellen in groepsverband",
                        domains: ["A", "D1", "I3"],
                        weight: .5
                    },
                    {
                        type: "PO",
                        year: 5,
                        period: 3,
                        description: "Modelstudie over een bewegingsverschijnsel Individueel werk",
                        domains: ["A", "I2"],
                        weight: .5
                    }
                ]
            }
        ]
    },
    {
        type: "SUBJ",
        fullname: "Scheikunde",
        shortname: "Sck.",
        assignments: [
            {
                type: "MET",
                year: 5,
                period: 1,
                description: "Engelstalige presentatie in groepsverband over een door klimaatverandering veroorzaakt mondiaal probleem",
                domains: ["A", "E3", "F5", "G4", "G5"],
                weight: 1
            },
            {
                type: "SET",
                year: 5,
                period: 2,
                description: "Toets over de werking van het menselijk lichaam op gebied van voeding en gezondheid",
                domains: ["A", "C7", "D4"],
                weight: 1
            },
            {
                type: "PO",
                year: 5,
                period: 3,
                description: "Individuele verslaglegging van uitvoer van en werkhouding voor verscheidene practica op het gebied van gezondheid",
                domains: ["A", "C5", "C8", "D2", "F4"],
                weight: 1
            },
            {
                type: "PO",
                year: 5,
                period: 3,
                description: "Individueel verslag van een bezoek aan externe organisatie op het gebied van duurzaamheid",
                domains: ["A", "C9", "C10"],
                weight: 1
            },
            {
                type: "PO",
                year: 6,
                period: 1,
                description: "Werkplan opstellen voor gekozen onderzoeksvraag die betrekking hebben op bijvoorbeeld nanotechnologie. Eventueel uit te voeren.",
                domains: ["A", "E4", "E5"],
                weight: 1
            }
        ]
    },
    {
        type: "COMB",
        fullname: "Combinatiecijfer",
        shortname: "Comb.",
        assignments: [
            {
                type: "SUBJ",
                fullname: "Maatschappijleer",
                shortname: "Maat.",
                assignments: [
                    {
                        type: "PO",
                        year: 4,
                        period: 1,
                        description: "Politieke partijen en opvattingen over de verzorgingsstaat boekje in groepjes",
                        domains: ["A", "C", "D"],
                        weight: 1
                    },
                    {
                        type: "PO",
                        year: 4,
                        period: 2,
                        description: "Rechten, rechtvaardigheid en de pluriforme samenleving documentaire in groepjes",
                        domains: ["A", "B", "C", "E"],
                        weight: 1
                    },
                    {
                        type: "SET",
                        year: 5,
                        period: 1,
                        description: "Politiek: regels en instituties",
                        domains: ["B", "C", "D"],
                        weight: 1
                    },
                    {
                        type: "PO",
                        year: 5,
                        period: 2,
                        description: "Portfolio: maatschappelijke instituties en ontwikkelingen",
                        domains: ["A", "B", "C", "D", "E"],
                        weight: 1
                    }
                ],
                weight: 1
            },
            {
                type: "SUBJ",
                fullname: "Algemene Natuurwetenschappen (Filosofie en Technologie)",
                shortname: "ANW",
                assignments: [
                    {
                        type: "PO",
                        year: 5,
                        period: 1,
                        description: "Duo's\n- Technisch ontwerp (ontwerpcyclus)\n- Product of prototype\n- Reflectie op duurzaamheidsfilosofie",
                        domains: ["A2", "A4", "A5", "D2"],
                        weight: 1,
                    },
                    {
                        type: "PO",
                        year: 5,
                        period: 3,
                        description: "Duo's\nModelleren (Game Theory)\nModel maken\n\nVerslag schrijven\n- Wetenschapsfilosofie\n- Beschouwing Game\nTheory\n- Reflectie Modelleren",
                        domains: ["A6", "B1", "B2", "C3", "F3"],
                        weight: 1,
                    },
                    {
                        type: "PO",
                        year: 5,
                        period: 4,
                        description: "Duo of individueel\nData Science toegepast in profielwerkstuk",
                        domains: ["A1", "A3", "B1", "B2"],
                        weight: 1,
                    },
                    {
                        type: "MET",
                        year: 6,
                        period: 1,
                        description: "Debat (2 tegen 2) individuele beoordeling\n\nOnderwerp:\nCultuurkritiek",
                        domains: ["A7", "B3"],
                        weight: 1,
                    }
                ],
                weight: 1
            },
            {
                type: "SUBJ",
                fullname: "Culturele en Kunstzinnige vorming",
                shortname: "CKV",
                assignments: [
                    {
                        type: "PO",
                        year: 4,
                        period: 1,
                        description: "Corporate identity boek politieke partijen op basis van politieke ideologie en geschiedenis in groepjes",
                        domains: ["A", "B", "C", "D"],
                        weight: 1,
                    },
                    {
                        type: "PO",
                        year: 4,
                        period: 2,
                        description: "Documentaire maken over maatschappelijk onderwerp in groepjes",
                        domains: ["A", "B", "C", "D"],
                        weight: 1,
                    },
                    {
                        type: "PO",
                        year: 5,
                        period: 1,
                        description: "Portfolio CKV-activiteiten: keuze, bijwonen, beschrijving en analyse van 4 verschillende culturele activiteiten. Presentatie in een portfolio. (individueel)",
                        domains: ["A", "B", "C", "D"],
                        weight: 1,
                    }
                ],
                weight: 1
            },
            {
                type: "PO",
                year: 6,
                period: 3,
                description: "Verslaglegging van het profielwerkstuk en bijbehorende mondelinge toelichting",
                weight: 1,
            }
        ]
    }
]
