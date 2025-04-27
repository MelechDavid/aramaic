import React, { useState, useEffect } from 'react';
import '../../roughquiz/quizdata/styles.css';

const AramicQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Quiz configuration
  const quizConfig = {
    features: {
      sounds: false,
      animations: true,
      translations: true
    }
  };

  // Audio elements
  const correctSound = new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAHwADAwMDAwMDAwMDAwMDHS0tLS0tLS0tLS0tLS04+Pj4+Pj4+Pj4+Pj4+P///////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYgAAAAAAAAfIYbxEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAKGAZIWUEQAAAAAM4xTsZ6zgQHjHZdGGeMnMchQYZD+jhlA9D0PiY/0OMfUPiBj0f+oB9D4hCHz/6gYt+YP6wb/qAgZtwg3//6gvbtH//q+5hxzFqL1c7/n+9IbtWu7kS//+MYxBUK2AIg/gCQAJDPLgdHKuZJk8Y9iYjGNSibNaiKrWcjJSYB0wwwXJJHqC5JSHgmILHKmIlITqRMfJyExJpbzLXGMQdm1+OYmbEaUJlEjTL1SuXtNMvKFk2ql4yypdT//+MYxCYL4DIl/hDwAFyKmWBIOmGpsElJmwsNmTDJiIMnICVJo0IcExmMCRKTJBgwQaRrUR78nLRLf/lJlFL/9FVJVFFWVF54y0qVKlVdU0jNKimpqogxQVUVVRYQYoJBQcHB//+MYxDUNAAZFVgMSApIJCQ4VDCpMED4qKm8QEEAIEAXHAuWHh4YDAQCDA0bEgUFBQUFCgoKCgoKCgUFBQUFAoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKC');
  const wrongSound = new Audio('data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAHwADAwMDAwMDAwMDAwMDHS0tLS0tLS0tLS0tLS04+Pj4+Pj4+Pj4+Pj4+P///////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJATgAAAAAAAAfFCVUdYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+MYxAAKkAYoWUEQAAAAAlkt7tTuCxmVAhpLqDLxmMw+EYRhnHwfEYTHEYkOA+IwZLvglnBcPgynKvBFGwQ5/gcflnBcK8+ZwXB8M4L/+okh/ggCf4jAuD4JZ+SQ//+MYxBQKmAIRXgBQAD4ZxS//L3/+yjWQ/L3/oRYg2W1NzLILc1Gaxh7pNyspFNiVnUynqJSLtJWuiJtqQakQaiSrXVFdSVJxK6kSb//1fVVNS//+vf////p/9QzQmJiYhIe//+MYxCgMMAY+ngBAAFnGLdVXUN9Q31Fq6mpqbmplJpcWcYtrU1NSUWrqampqaDDGDFHJyUWrqampuammhkYtXU1JRauhr81NTQxcXFHJyam5qaSYuLi1NzUlFq6kstXU1JRaujx//+MYxCsOWAZR/hBSAMKggZSoIEREgJf/uJIgTvLlwQJBAkECQkECQkECQQJBAkECQQJBAkJBAkECQQJCQQJf/QIJD/+QkP///8AQkEiREP/+QkECQQJBAkJBAkECQQJBAkJBAkECQQJ');
  
  // 100 Talmudic Aramaic Quiz Questions
  const quizData = [
    {
      "category": "Binyanim",
      "question": "What binyan (verb form) is the Aramaic word 'קְטַל' (q'tal)?",
      "options": [
        "Pe'al",
        "Pa'el",
        "Af'el",
        "Itpe'el"
      ],
      "correct": 0,
      "explanation": "The Aramaic word 'קְטַל' (q'tal) is in the <b>Pe'al</b> form, which is the basic verb form in Aramaic. This is equivalent to the Hebrew 'Qal' binyan. Pe'al is used for simple actions in their active voice.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Pe'al Conjugation Example</h4>\n                    <table>\n                        <tr><th>Form</th><th>Transliteration</th><th>Meaning</th></tr>\n                        <tr><td>קְטַל</td><td>q'tal</td><td>he killed</td></tr>\n                        <tr><td>קָטְלָא</td><td>qāṭlā</td><td>she killed</td></tr>\n                        <tr><td>קְטַלְתְּ</td><td>q'talt</td><td>you killed</td></tr>\n                        <tr><td>קְטַלִית</td><td>q'talit</td><td>I killed</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Binyanim",
      "question": "Which binyan is used to express the passive form of Pe'al?",
      "options": [
        "Itpe'el",
        "Itpa'al",
        "Af'el",
        "Pa'el"
      ],
      "correct": 0,
      "explanation": "The passive form of Pe'al is <b>Itpe'el</b>, which is formed by adding the prefix 'אית' (it-) to the Pe'al form. This creates a passive meaning to the action. For example, 'כְּתַב' (ketav - he wrote) becomes 'אִתְכְּתֵב' (itkətev - it was written).",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Active to Passive Transformation</h4>\n                    <table>\n                        <tr><th>Binyan</th><th>Example</th><th>Meaning</th></tr>\n                        <tr><td>Pe'al (active)</td><td>כְּתַב</td><td>he wrote</td></tr>\n                        <tr><td>Itpe'el (passive)</td><td>אִתְכְּתֵב</td><td>it was written</td></tr>\n                        <tr><td>Pe'al (active)</td><td>קְטַל</td><td>he killed</td></tr>\n                        <tr><td>Itpe'el (passive)</td><td>אִתְקְטֵל</td><td>he was killed</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Binyanim",
      "question": "Which binyan is used for causative actions in Aramaic?",
      "options": [
        "Pe'al",
        "Pa'el",
        "Af'el",
        "Itpa'al"
      ],
      "correct": 2,
      "explanation": "<b>Af'el</b> is the causative binyan in Aramaic. It's formed by adding the prefix 'א' (a-) to the root. This form expresses causing someone/something to perform an action. It's equivalent to Hebrew Hif'il.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Af'el (Causative) Examples</h4>\n                    <table>\n                        <tr><th>Root</th><th>Pe'al</th><th>Af'el</th></tr>\n                        <tr><td>כ.ת.ב</td><td>כְּתַב (he wrote)</td><td>אַכְתֵּב (he caused to write)</td></tr>\n                        <tr><td>ש.ל.מ</td><td>שְׁלֵם (he finished)</td><td>אַשְׁלֵם (he caused to finish)</td></tr>\n                        <tr><td>י.ד.ע</td><td>יְדַע (he knew)</td><td>אוֹדַע (he informed/made known)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Binyanim",
      "question": "Identify the binyan of the word 'אִיתְכְּתַב' (itkətav)",
      "options": [
        "Pe'al",
        "Pa'el",
        "Af'el",
        "Itpe'el"
      ],
      "correct": 3,
      "explanation": "The Aramaic word 'אִיתְכְּתַב' (itkətav) is in the <b>Itpe'el</b> form, which is the passive form of Pe'al. It's identified by the prefix 'אית' (it-) attached to the root. This word means 'it was written' - the passive form of 'he wrote'.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Itpe'el Formation</h4>\n                    <table>\n                        <tr><th>Components</th><th>Example</th></tr>\n                        <tr><td>Prefix</td><td>אִיתְ- (it-)</td></tr>\n                        <tr><td>Root</td><td>כ.ת.ב (k.t.b)</td></tr>\n                        <tr><td>Result</td><td>אִיתְכְּתַב (itkətav - it was written)</td></tr>\n                    </table>\n                    <p>Other examples:</p>\n                    <p>אִיתְאֲמַר (it'amar) - \"it was said\" from א.מ.ר</p>\n                    <p>אִיתְעֲבַד (it'avad) - \"it was done\" from ע.ב.ד</p>\n                </div>"
    },
    {
      "category": "Binyanim",
      "question": "What is the reflexive form of Pa'el?",
      "options": [
        "Pe'al",
        "Af'el",
        "Itpe'el",
        "Itpa'al"
      ],
      "correct": 3,
      "explanation": "The reflexive form of Pa'el is <b>Itpa'al</b>. Just as Itpe'el is the passive/reflexive of Pe'al, Itpa'al is the passive/reflexive of Pa'el. It's created by adding the prefix 'אית' (it-) to the Pa'el form. This creates reflexive meanings ('himself', 'themselves').",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Pa'el to Itpa'al Transformation</h4>\n                    <table>\n                        <tr><th>Binyan</th><th>Example</th><th>Meaning</th></tr>\n                        <tr><td>Pa'el</td><td>קַטֵּל</td><td>he massacred</td></tr>\n                        <tr><td>Itpa'al</td><td>אִיתְקַטַּל</td><td>he got himself killed</td></tr>\n                        <tr><td>Pa'el</td><td>חַדֵּת</td><td>he renewed</td></tr>\n                        <tr><td>Itpa'al</td><td>אִיתְחַדַּת</td><td>he renewed himself</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Verb Tense",
      "question": "In Aramaic, which form represents the perfect (completed action)?",
      "options": [
        "קָטֵיל (qāṭēl)",
        "קְטַל (qəṭal)",
        "מִקְטַל (miqṭal)",
        "יִקְטוֹל (yiqṭōl)"
      ],
      "correct": 1,
      "explanation": "In Aramaic, the perfect (completed action) is represented by <b>קְטַל</b> (qəṭal). This form indicates that an action has been completed. It functions similarly to the perfect tense in English (e.g., 'he has written', 'she has spoken').",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Perfect Form Examples</h4>\n                    <table>\n                        <tr><th>Aramaic Perfect</th><th>Root</th><th>Translation</th></tr>\n                        <tr><td>כְּתַב</td><td>כ.ת.ב</td><td>he wrote/has written</td></tr>\n                        <tr><td>אֲמַר</td><td>א.מ.ר</td><td>he said/has said</td></tr>\n                        <tr><td>עֲבַד</td><td>ע.ב.ד</td><td>he did/has done</td></tr>\n                        <tr><td>שְׁמַע</td><td>ש.מ.ע</td><td>he heard/has heard</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Verb Tense",
      "question": "Which form represents the imperfect (incomplete action) in Aramaic?",
      "options": [
        "קְטַל (qəṭal)",
        "קָטֵיל (qāṭēl)",
        "יִקְטוֹל (yiqṭōl)",
        "קְטִיל (qəṭīl)"
      ],
      "correct": 2,
      "explanation": "The imperfect (incomplete action) in Aramaic is represented by <b>יִקְטוֹל</b> (yiqṭōl). This form indicates ongoing or future actions. It's formed with prefixes rather than suffixes, like the Hebrew imperfect.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Imperfect Form Examples</h4>\n                    <table>\n                        <tr><th>Person</th><th>Aramaic Imperfect</th><th>Translation</th></tr>\n                        <tr><td>3rd masc. sing.</td><td>יִכְתּוֹב</td><td>he will write</td></tr>\n                        <tr><td>3rd fem. sing.</td><td>תִּכְתּוֹב</td><td>she will write</td></tr>\n                        <tr><td>2nd masc. sing.</td><td>תִּכְתּוֹב</td><td>you will write</td></tr>\n                        <tr><td>1st sing.</td><td>אֶכְתּוֹב</td><td>I will write</td></tr>\n                        <tr><td>3rd pl.</td><td>יִכְתְּבוּן</td><td>they will write</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Verb Suffixes",
      "question": "What is the first-person singular suffix in Aramaic?",
      "options": [
        "־ִית (-it)",
        "־ָא (-a)",
        "־ָת (-at)",
        "־וּ (-u)"
      ],
      "correct": 0,
      "explanation": "The first-person singular suffix in Aramaic is <b>־ִית</b> (-it). This suffix is attached to perfect verbs to indicate 'I' as the subject. For example, 'כְּתַבִית' (kətavit) means 'I wrote'.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>First-Person Singular Examples</h4>\n                    <table>\n                        <tr><th>Root</th><th>Verb with -it suffix</th><th>Meaning</th></tr>\n                        <tr><td>כ.ת.ב</td><td>כְּתַבִית</td><td>I wrote</td></tr>\n                        <tr><td>א.מ.ר</td><td>אֲמַרִית</td><td>I said</td></tr>\n                        <tr><td>ע.ב.ד</td><td>עֲבַדִית</td><td>I did</td></tr>\n                        <tr><td>ש.מ.ע</td><td>שְׁמַעִית</td><td>I heard</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Verb Suffixes",
      "question": "What is the second-person masculine singular suffix in Aramaic?",
      "options": [
        "־ַת (-at)",
        "־ְתָּ (-ta)",
        "־ְתִּי (-ti)",
        "־וּ (-u)"
      ],
      "correct": 1,
      "explanation": "The second-person masculine singular suffix in Aramaic is <b>־ְתָּ</b> (-ta). This suffix is attached to perfect verbs when addressing a male 'you'. For example, 'כְּתַבְתָּ' (kətavta) means 'you (male) wrote'.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Second-Person Masculine Singular Examples</h4>\n                    <table>\n                        <tr><th>Root</th><th>Verb with -ta suffix</th><th>Meaning</th></tr>\n                        <tr><td>כ.ת.ב</td><td>כְּתַבְתָּ</td><td>you wrote</td></tr>\n                        <tr><td>א.מ.ר</td><td>אֲמַרְתָּ</td><td>you said</td></tr>\n                        <tr><td>ע.ב.ד</td><td>עֲבַדְתָּ</td><td>you did</td></tr>\n                        <tr><td>ש.מ.ע</td><td>שְׁמַעְתָּ</td><td>you heard</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Verb Suffixes",
      "question": "What is the third-person feminine singular suffix in Aramaic?",
      "options": [
        "־וּן (-un)",
        "־ָא (-a)",
        "־ַת (-at)",
        "־ָן (-an)"
      ],
      "correct": 2,
      "explanation": "The third-person feminine singular suffix in Aramaic is <b>־ַת</b> (-at). This suffix is attached to perfect verbs to indicate 'she' as the subject. For example, 'כְּתַבַת' (kətavat) means 'she wrote'.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Third-Person Feminine Singular Examples</h4>\n                    <table>\n                        <tr><th>Root</th><th>Verb with -at suffix</th><th>Meaning</th></tr>\n                        <tr><td>כ.ת.ב</td><td>כְּתַבַת</td><td>she wrote</td></tr>\n                        <tr><td>א.מ.ר</td><td>אֲמַרַת</td><td>she said</td></tr>\n                        <tr><td>ע.ב.ד</td><td>עֲבַדַת</td><td>she did</td></tr>\n                        <tr><td>ש.מ.ע</td><td>שְׁמַעַת</td><td>she heard</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Verb Suffixes",
      "question": "What is the first-person plural suffix in Aramaic?",
      "options": [
        "־ִין (-in)",
        "־נָא (-na)",
        "־תּוּן (-tun)",
        "־יַן (-yan)"
      ],
      "correct": 1,
      "explanation": "The masculine plural suffix in Aramaic is <b>־ִין</b> (-in). This suffix marks plural nouns and is the equivalent of the Hebrew ־ִים (-im) ending. For example, 'גַּבְרִין' (gavrin) means 'men'.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Masculine Plural Examples</h4>\n                    <table>\n                        <tr><th>Singular</th><th>Plural with -in</th><th>Meaning</th></tr>\n                        <tr><td>גְּבַר (gevar)</td><td>גַּבְרִין (gavrin)</td><td>men</td></tr>\n                        <tr><td>מֶלֶךְ (melekh)</td><td>מַלְכִין (malkhin)</td><td>kings</td></tr>\n                        <tr><td>סָפַר (safar)</td><td>סָפְרִין (safrin)</td><td>scribes</td></tr>\n                        <tr><td>חֲכָם (ḥakham)</td><td>חֲכִימִין (ḥakhimin)</td><td>wise men</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Verb Suffixes",
      "question": "What is the second-person masculine plural suffix in Aramaic?",
      "options": [
        "־ָן (-an)",
        "־תֶּם (-tem)",
        "־תּוּן (-tun)",
        "־ִין (-in)"
      ],
      "correct": 2,
      "explanation": "The construct state (status constructus) in Aramaic is formed by removing the definite article suffix (־ָא). This form is used in possessive constructions, linking two nouns together.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Construct State Formation</h4>\n                    <table>\n                        <tr><th>Emphatic State</th><th>Construct State</th><th>Example Usage</th></tr>\n                        <tr><td>מַלְכָּא (malka - the king)</td><td>מֶלֶךְ (melekh - king of)</td><td>מֶלֶךְ יִשְׂרָאֵל (melekh yisra'el - king of Israel)</td></tr>\n                        <tr><td>סִפְרָא (sifra - the book)</td><td>סְפַר (sefar - book of)</td><td>סְפַר אוֹרָיְתָא (sefar oraita - book of the Law)</td></tr>\n                        <tr><td>בֵּיתָא (beita - the house)</td><td>בֵּית (beit - house of)</td><td>בֵּית רַבָּן (beit rabban - house of the teacher)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Verb Suffixes",
      "question": "What is the third-person masculine plural suffix in Aramaic?",
      "options": [
        "־ָא (-a)",
        "־ִין (-in)",
        "־וּן (-un)",
        "־תּוּן (-tun)"
      ],
      "correct": 2,
      "explanation": "The emphatic state in Aramaic is marked with the suffix <b>־ָא</b> (-a) and typically indicates definiteness (like 'the' in English). Most nouns in Aramaic appear in this state in their basic form.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Emphatic State Formation</h4>\n                    <table>\n                        <tr><th>Absolute State</th><th>Emphatic State</th><th>Meaning</th></tr>\n                        <tr><td>מֶלֶךְ (melekh)</td><td>מַלְכָּא (malka)</td><td>the king</td></tr>\n                        <tr><td>סְפַר (sefar)</td><td>סִפְרָא (sifra)</td><td>the book</td></tr>\n                        <tr><td>גְּבַר (gevar)</td><td>גַּבְרָא (gavra)</td><td>the man</td></tr>\n                        <tr><td>בַּיִת (bayit)</td><td>בֵּיתָא (beita)</td><td>the house</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Verb Forms",
      "question": "What does the suffix ־ָאה (-a'ah) typically indicate in Aramaic?",
      "options": [
        "Definiteness",
        "Feminine gender",
        "Plurality",
        "Verb root"
      ],
      "correct": 1,
      "explanation": "The prefix <b>בְּ־</b> (b'-) in Aramaic marks the locative or instrumental case, indicating location ('in', 'at') or means ('by', 'with').",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Usage of Prefix b'-</h4>\n                    <table>\n                        <tr><th>Without Prefix</th><th>With b'- Prefix</th><th>Meaning</th></tr>\n                        <tr><td>בֵּיתָא (beita)</td><td>בְּבֵיתָא (b'veita)</td><td>in the house</td></tr>\n                        <tr><td>יְרוּשְׁלֵם (yerushalem)</td><td>בִּירוּשְׁלֵם (birushalem)</td><td>in Jerusalem</td></tr>\n                        <tr><td>יְדָא (yeda)</td><td>בִּידָא (bida)</td><td>by/with the hand</td></tr>\n                        <tr><td>לֵילְיָא (leilya)</td><td>בְּלֵילְיָא (b'leilya)</td><td>at night</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Nouns",
      "question": "What is the definite article suffix in Aramaic?",
      "options": [
        "־ְתָּא (-ta)",
        "־ִי (-i)",
        "־ָא (-a)",
        "־ִין (-in)"
      ],
      "correct": 2,
      "explanation": "The prefix <b>לְ־</b> (l'-) in Aramaic marks the dative or directional case, indicating the recipient ('to', 'for') of an action or a direction.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Usage of Prefix l'-</h4>\n                    <table>\n                        <tr><th>Without Prefix</th><th>With l'- Prefix</th><th>Meaning</th></tr>\n                        <tr><td>גַּבְרָא (gavra)</td><td>לְגַבְרָא (l'gavra)</td><td>to/for the man</td></tr>\n                        <tr><td>מַלְכָּא (malka)</td><td>לְמַלְכָּא (l'malka)</td><td>to/for the king</td></tr>\n                        <tr><td>בֵּיתָא (beita)</td><td>לְבֵיתָא (l'veita)</td><td>to the house</td></tr>\n                        <tr><td>תַּלְמִידָא (talmida)</td><td>לְתַלְמִידָא (l'talmida)</td><td>to/for the student</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Nouns",
      "question": "What is the masculine plural suffix in Aramaic?",
      "options": [
        "־ָא (-a)",
        "־ִי (-i)",
        "־ִין (-in)",
        "־ַת (-at)"
      ],
      "correct": 2,
      "explanation": "The archaic genitive ending <b>־ֵי</b> (-e) in Aramaic is sometimes retained in construct forms, particularly in older or fixed expressions.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Genitive Ending Examples</h4>\n                    <table>\n                        <tr><th>Regular Form</th><th>With -e Genitive</th><th>Meaning</th></tr>\n                        <tr><td>בֵּית (beit)</td><td>בֵּיתֵי (beite)</td><td>house of</td></tr>\n                        <tr><td>בְּנֵי (b'ne)</td><td>בְּנֵי (b'ne)</td><td>sons of</td></tr>\n                        <tr><td>רַב (rav)</td><td>רַבֵּי (rabbei)</td><td>master of</td></tr>\n                        <tr><td>שְׁמָא (sh'ma)</td><td>שְׁמֵי (sh'mei)</td><td>name of</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Nouns",
      "question": "How is the construct state (status constructus) formed in Aramaic?",
      "options": [
        "By adding the suffix ־ָא (-a)",
        "By removing the definite article suffix",
        "By changing the vowel pattern",
        "By adding the prefix מְ- (mə-)"
      ],
      "correct": 1,
      "explanation": "The suffix <b>־ִי</b> (-i) in Aramaic indicates first-person singular possession ('my') when attached to a noun.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>First-Person Singular Possessive Examples</h4>\n                    <table>\n                        <tr><th>Noun</th><th>With -i Suffix</th><th>Meaning</th></tr>\n                        <tr><td>אַבָּא (abba)</td><td>אַבִּי (abbi)</td><td>my father</td></tr>\n                        <tr><td>סִפְרָא (sifra)</td><td>סִפְרִי (sifri)</td><td>my book</td></tr>\n                        <tr><td>בֵּיתָא (beita)</td><td>בֵּיתִי (beiti)</td><td>my house</td></tr>\n                        <tr><td>יְדָא (yeda)</td><td>יְדִי (yedi)</td><td>my hand</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Nouns",
      "question": "What is the emphatic state in Aramaic?",
      "options": [
        "The construct state used in possessive constructions",
        "The form with no suffix marking definiteness",
        "The form with the suffix ־ָא (-a) marking definiteness",
        "The plural form of a noun"
      ],
      "correct": 2,
      "explanation": "The suffix <b>־ָךְ</b> (-akh) in Aramaic indicates second-person feminine singular possession ('your') when attached to a noun.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Second-Person Feminine Singular Examples</h4>\n                    <table>\n                        <tr><th>Noun</th><th>With -akh Suffix</th><th>Meaning</th></tr>\n                        <tr><td>סִפְרָא (sifra)</td><td>סִפְרָךְ (sifrakh)</td><td>your book</td></tr>\n                        <tr><td>בֵּיתָא (beita)</td><td>בֵּיתָךְ (beitakh)</td><td>your house</td></tr>\n                        <tr><td>יְדָא (yeda)</td><td>יְדָךְ (yedakh)</td><td>your hand</td></tr>\n                        <tr><td>אַרְעָא (ar'a)</td><td>אַרְעָךְ (ar'akh)</td><td>your land</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Nouns",
      "question": "What case is marked by the prefix בְּ־ (b'-) in Aramaic?",
      "options": [
        "Nominative",
        "Accusative",
        "Locative/instrumental",
        "Vocative"
      ],
      "correct": 2,
      "explanation": "The suffix <b>־ֵיה</b> (-eh) in Aramaic indicates third-person masculine singular possession ('his') when attached to a noun.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Third-Person Masculine Singular Examples</h4>\n                    <table>\n                        <tr><th>Noun</th><th>With -eh Suffix</th><th>Meaning</th></tr>\n                        <tr><td>סִפְרָא (sifra)</td><td>סִפְרֵיה (sifreh)</td><td>his book</td></tr>\n                        <tr><td>בֵּיתָא (beita)</td><td>בֵּיתֵיה (beiteh)</td><td>his house</td></tr>\n                        <tr><td>יְדָא (yeda)</td><td>יְדֵיה (yedeh)</td><td>his hand</td></tr>\n                        <tr><td>רֵישָׁא (reisha)</td><td>רֵישֵׁיה (reisheh)</td><td>his head</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Nouns",
      "question": "What case is marked by the prefix לְ־ (l'-) in Aramaic?",
      "options": [
        "Genitive",
        "Dative/directional",
        "Ablative",
        "Accusative"
      ],
      "correct": 1,
      "explanation": "The suffix <b>־ַה</b> (-ah) in Aramaic indicates third-person feminine singular possession ('her') when attached to a noun.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Third-Person Feminine Singular Examples</h4>\n                    <table>\n                        <tr><th>Noun</th><th>With -ah Suffix</th><th>Meaning</th></tr>\n                        <tr><td>סִפְרָא (sifra)</td><td>סִפְרַה (sifrah)</td><td>her book</td></tr>\n                        <tr><td>בֵּיתָא (beita)</td><td>בֵּיתַה (beitah)</td><td>her house</td></tr>\n                        <tr><td>יְדָא (yeda)</td><td>יְדַה (yedah)</td><td>her hand</td></tr>\n                        <tr><td>בְּרַת (b'rat)</td><td>בְּרַתַה (b'ratah)</td><td>her daughter</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Nouns",
      "question": "What is the archaic genitive-marked ending that sometimes appears in Aramaic?",
      "options": [
        "־ִין (-in)",
        "־ֵי (-e)",
        "־ָא (-a)",
        "־ֵיה (-eh)"
      ],
      "correct": 1,
      "explanation": "The suffix <b>־נָא</b> (-na) in Aramaic indicates first-person plural possession ('our') when attached to a noun.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>First-Person Plural Examples</h4>\n                    <table>\n                        <tr><th>Noun</th><th>With -na Suffix</th><th>Meaning</th></tr>\n                        <tr><td>סִפְרָא (sifra)</td><td>סִפְרָנָא (sifrana)</td><td>our book</td></tr>\n                        <tr><td>בֵּיתָא (beita)</td><td>בֵּיתָנָא (beitana)</td><td>our house</td></tr>\n                        <tr><td>יְדָא (yeda)</td><td>יְדָנָא (yedana)</td><td>our hand</td></tr>\n                        <tr><td>אֲתַר (atar)</td><td>אֲתַרָנָא (atarana)</td><td>our place</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Pronominal Suffixes",
      "question": "What does the suffix ־ִי (-i) indicate when attached to a noun in Aramaic?",
      "options": [
        "My (first-person singular possessive)",
        "You (second-person masculine singular)",
        "He (third-person masculine singular)",
        "We (first-person plural)"
      ],
      "correct": 0,
      "explanation": "The suffix <b>־הוֹן</b> (-hon) in Aramaic indicates third-person masculine plural possession ('their') when attached to a noun.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Third-Person Masculine Plural Examples</h4>\n                    <table>\n                        <tr><th>Noun</th><th>With -hon Suffix</th><th>Meaning</th></tr>\n                        <tr><td>סִפְרָא (sifra)</td><td>סִפְרְהוֹן (sifrehon)</td><td>their book</td></tr>\n                        <tr><td>בֵּיתָא (beita)</td><td>בֵּיתְהוֹן (beitehon)</td><td>their house</td></tr>\n                        <tr><td>יְדָא (yeda)</td><td>יְדֵיהוֹן (yedehon)</td><td>their hand</td></tr>\n                        <tr><td>רַב (rav)</td><td>רַבְּהוֹן (rabbehon)</td><td>their teacher</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Pronominal Suffixes",
      "question": "What does the suffix ־ָךְ (-akh) indicate when attached to a noun in Aramaic?",
      "options": [
        "My (first-person singular possessive)",
        "Your (second-person feminine singular)",
        "Her (third-person feminine singular)",
        "Their (third-person plural)"
      ],
      "correct": 1,
      "explanation": "The suffix <b>־כוֹן</b> (-khon) in Aramaic indicates second-person plural possession ('your' when speaking to multiple people) when attached to a noun.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Second-Person Plural Examples</h4>\n                    <table>\n                        <tr><th>Noun</th><th>With -khon Suffix</th><th>Meaning</th></tr>\n                        <tr><td>סִפְרָא (sifra)</td><td>סִפְרְכוֹן (sifrekhon)</td><td>your book</td></tr>\n                        <tr><td>בֵּיתָא (beita)</td><td>בֵּיתְכוֹן (beitekhon)</td><td>your house</td></tr>\n                        <tr><td>יְדָא (yeda)</td><td>יְדֵיכוֹן (yedekhon)</td><td>your hand</td></tr>\n                        <tr><td>אַרְעָא (ar'a)</td><td>אַרְעֲכוֹן (ar'akhon)</td><td>your land</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Pronominal Suffixes",
      "question": "What does the suffix ־ֵיה (-eh) indicate when attached to a noun in Aramaic?",
      "options": [
        "Your (second-person masculine singular)",
        "Her (third-person feminine singular)",
        "His (third-person masculine singular)",
        "Their (third-person masculine plural)"
      ],
      "correct": 2,
      "explanation": "The Aramaic independent pronoun for 'I' is <b>אֲנָא</b> (ana). It is used as a standalone pronoun, unlike pronominal suffixes that attach to nouns or verbs.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>First-Person Singular Independent Pronoun</h4>\n                    <table>\n                        <tr><th>Pronoun</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>אֲנָא</td><td>ana</td><td>אֲנָא אָמַרִית (ana amarit) - I said</td></tr>\n                        <tr><td>אֲנָא</td><td>ana</td><td>אֲנָא הוּא (ana hu) - I am he</td></tr>\n                        <tr><td>אֲנָא</td><td>ana</td><td>אֲנָא בְּבֵיתָא (ana b'veita) - I am in the house</td></tr>\n                        <tr><td>אֲנָא</td><td>ana</td><td>אֲנָא יָדַעְנָא (ana yada'na) - I know</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Pronominal Suffixes",
      "question": "What does the suffix ־ַה (-ah) indicate when attached to a noun in Aramaic?",
      "options": [
        "Your (second-person feminine singular)",
        "His (third-person masculine singular)",
        "Her (third-person feminine singular)",
        "Their (third-person feminine plural)"
      ],
      "correct": 2,
      "explanation": "The Aramaic independent pronoun for 'you' (masculine singular) is <b>אַתָּה</b> (atta). It is used as a standalone pronoun to address a male.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Second-Person Masculine Singular Independent Pronoun</h4>\n                    <table>\n                        <tr><th>Pronoun</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>אַתָּה</td><td>atta</td><td>אַתָּה אָמַרְתְּ (atta amart) - you said</td></tr>\n                        <tr><td>אַתָּה</td><td>atta</td><td>אַתָּה הוּא מַלְכָּא (atta hu malka) - you are the king</td></tr>\n                        <tr><td>אַתָּה</td><td>atta</td><td>אַתָּה זְכַיְתָא (atta zekhayita) - you are innocent</td></tr>\n                        <tr><td>אַתָּה</td><td>atta</td><td>מַאן אַתָּה (man atta) - who are you?</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Pronominal Suffixes",
      "question": "What does the suffix ־נָא (-na) indicate when attached to a noun in Aramaic?",
      "options": [
        "Our (first-person plural possessive)",
        "My (first-person singular emphatic)",
        "Your (second-person plural)",
        "Their (third-person plural)"
      ],
      "correct": 0,
      "explanation": "The Aramaic independent pronoun for 'you' (feminine singular) is <b>אַנְתְּ</b> (ant). It is used as a standalone pronoun to address a female.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Second-Person Feminine Singular Independent Pronoun</h4>\n                    <table>\n                        <tr><th>Pronoun</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>אַנְתְּ</td><td>ant</td><td>אַנְתְּ אָמַרְתְּ (ant amart) - you said</td></tr>\n                        <tr><td>אַנְתְּ</td><td>ant</td><td>אַנְתְּ הִיא (ant hi) - you are she</td></tr>\n                        <tr><td>אַנְתְּ</td><td>ant</td><td>אַנְתְּ חַכִּימָא (ant ḥakkima) - you are wise</td></tr>\n                        <tr><td>אַנְתְּ</td><td>ant</td><td>אַנְתְּ יָתְבָא הָכָא (ant yatva haka) - you are sitting here</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Pronominal Suffixes",
      "question": "What does the suffix ־הוֹן (-hon) indicate when attached to a noun in Aramaic?",
      "options": [
        "Your (second-person plural)",
        "Our (first-person plural)",
        "Their (third-person masculine plural)",
        "Her (third-person feminine singular)"
      ],
      "correct": 2,
      "explanation": "The Aramaic independent pronoun for 'he' is <b>הוּא</b> (hu). It is used as a standalone pronoun to refer to a male.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Third-Person Masculine Singular Independent Pronoun</h4>\n                    <table>\n                        <tr><th>Pronoun</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>הוּא</td><td>hu</td><td>הוּא אָמַר (hu amar) - he said</td></tr>\n                        <tr><td>הוּא</td><td>hu</td><td>הוּא מַלְכָּא (hu malka) - he is the king</td></tr>\n                        <tr><td>הוּא</td><td>hu</td><td>הוּא רַבָּא (hu rabba) - he is great</td></tr>\n                        <tr><td>הוּא</td><td>hu</td><td>מַאן הוּא (man hu) - who is he?</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Pronominal Suffixes",
      "question": "What does the suffix ־כוֹן (-khon) indicate when attached to a noun in Aramaic?",
      "options": [
        "His (third-person masculine singular)",
        "Their (third-person plural)",
        "Your (second-person plural)",
        "Our (first-person plural)"
      ],
      "correct": 2,
      "explanation": "The Aramaic independent pronoun for 'she' is <b>הִיא</b> (hi). It is used as a standalone pronoun to refer to a female.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Third-Person Feminine Singular Independent Pronoun</h4>\n                    <table>\n                        <tr><th>Pronoun</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>הִיא</td><td>hi</td><td>הִיא אָמְרַת (hi amrat) - she said</td></tr>\n                        <tr><td>הִיא</td><td>hi</td><td>הִיא מַלְכְּתָא (hi malk'ta) - she is the queen</td></tr>\n                        <tr><td>הִיא</td><td>hi</td><td>הִיא שַׁפִּירָא (hi shappira) - she is beautiful</td></tr>\n                        <tr><td>הִיא</td><td>hi</td><td>מַאן הִיא (man hi) - who is she?</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Independent Pronouns",
      "question": "What is the Aramaic independent pronoun for 'I'?",
      "options": [
        "אַנְתְּ (ant)",
        "אֲנָא (ana)",
        "הוּא (hu)",
        "אֲנַחְנָא (anakhna)"
      ],
      "correct": 1,
      "explanation": "The Aramaic independent pronoun for 'we' is <b>אֲנַחְנָא</b> (anakhna). It is used as a standalone pronoun to refer to a group that includes the speaker.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>First-Person Plural Independent Pronoun</h4>\n                    <table>\n                        <tr><th>Pronoun</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>אֲנַחְנָא</td><td>anakhna</td><td>אֲנַחְנָא אָמַרְנָא (anakhna amarna) - we said</td></tr>\n                        <tr><td>אֲנַחְנָא</td><td>anakhna</td><td>אֲנַחְנָא בְּנֵי יִשְׂרָאֵל (anakhna b'nei yisra'el) - we are the sons of Israel</td></tr>\n                        <tr><td>אֲנַחְנָא</td><td>anakhna</td><td>אֲנַחְנָא הָכָא (anakhna haka) - we are here</td></tr>\n                        <tr><td>אֲנַחְנָא</td><td>anakhna</td><td>אֲנַחְנָא יָדְעִינַן (anakhna yad'inan) - we know</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Independent Pronouns",
      "question": "What is the Aramaic independent pronoun for 'you' (masculine singular)?",
      "options": [
        "אַנְתְּ (ant)",
        "אַתָּה (atta)",
        "אַנְתּוּן (antun)",
        "אַת (at)"
      ],
      "correct": 1,
      "explanation": "The Aramaic independent pronoun for 'you' (plural) is <b>אַנְתּוּן</b> (antun). It is used as a standalone pronoun to address multiple people.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Second-Person Plural Independent Pronoun</h4>\n                    <table>\n                        <tr><th>Pronoun</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>אַנְתּוּן</td><td>antun</td><td>אַנְתּוּן אֲמַרְתּוּן (antun amartun) - you said</td></tr>\n                        <tr><td>אַנְתּוּן</td><td>antun</td><td>אַנְתּוּן חַכִּימִין (antun ḥakkimin) - you are wise</td></tr>\n                        <tr><td>אַנְתּוּן</td><td>antun</td><td>אַנְתּוּן זְכָאִין (antun zakka'in) - you are innocent</td></tr>\n                        <tr><td>אַנְתּוּן</td><td>antun</td><td>מַאן אַנְתּוּן (man antun) - who are you?</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Independent Pronouns",
      "question": "What is the Aramaic independent pronoun for 'you' (feminine singular)?",
      "options": [
        "אַנְתְּ (ant)",
        "אַת (at)",
        "אַנְתָּה (atta)",
        "אַנְתִּין (antin)"
      ],
      "correct": 0,
      "explanation": "The Aramaic independent pronoun for 'they' is <b>אִנּוּן</b> (innun). It is used as a standalone pronoun to refer to multiple people or things.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Third-Person Plural Independent Pronoun</h4>\n                    <table>\n                        <tr><th>Pronoun</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>אִנּוּן</td><td>innun</td><td>אִנּוּן אָמְרִין (innun amrin) - they say</td></tr>\n                        <tr><td>אִנּוּן</td><td>innun</td><td>אִנּוּן רַבָּנִין (innun rabbanin) - they are teachers</td></tr>\n                        <tr><td>אִנּוּן</td><td>innun</td><td>אִנּוּן חַכִּימִין (innun ḥakkimin) - they are wise</td></tr>\n                        <tr><td>אִנּוּן</td><td>innun</td><td>מַאן אִנּוּן (man innun) - who are they?</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Independent Pronouns",
      "question": "What is the Aramaic independent pronoun for 'he'?",
      "options": [
        "הִיא (hi)",
        "הוּא (hu)",
        "אִנּוּן (innun)",
        "אַנְחְנָא (anakhna)"
      ],
      "correct": 1,
      "explanation": "The Aramaic demonstrative pronoun for 'this' (masculine) is <b>הָדֵין</b> (haden). It is used to point out a masculine object that is near.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Demonstrative 'This' (Masculine) Examples</h4>\n                    <table>\n                        <tr><th>Demonstrative</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>הָדֵין</td><td>haden</td><td>הָדֵין גַּבְרָא (haden gavra) - this man</td></tr>\n                        <tr><td>הָדֵין</td><td>haden</td><td>הָדֵין סִפְרָא (haden sifra) - this book</td></tr>\n                        <tr><td>הָדֵין</td><td>haden</td><td>הָדֵין יוֹמָא (haden yoma) - this day</td></tr>\n                        <tr><td>הָדֵין</td><td>haden</td><td>מַאן הָדֵין (man haden) - who is this?</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Independent Pronouns",
      "question": "What is the Aramaic independent pronoun for 'she'?",
      "options": [
        "הוּא (hu)",
        "הִיא (hi)",
        "אִינִין (inin)",
        "אַנְתְּ (ant)"
      ],
      "correct": 1,
      "explanation": "The Aramaic demonstrative pronoun for 'this' (feminine) is <b>הָדָא</b> (hada). It is used to point out a feminine object that is near.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Demonstrative 'This' (Feminine) Examples</h4>\n                    <table>\n                        <tr><th>Demonstrative</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>הָדָא</td><td>hada</td><td>הָדָא אִתְּתָא (hada itta) - this woman</td></tr>\n                        <tr><td>הָדָא</td><td>hada</td><td>הָדָא מִלְּתָא (hada milleta) - this word/matter</td></tr>\n                        <tr><td>הָדָא</td><td>hada</td><td>הָדָא אַרְעָא (hada ar'a) - this land</td></tr>\n                        <tr><td>הָדָא</td><td>hada</td><td>מַאי הָדָא (mai hada) - what is this?</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Independent Pronouns",
      "question": "What is the Aramaic independent pronoun for 'we'?",
      "options": [
        "אֲנַחְנָא (anakhna)",
        "אַנְתּוּן (antun)",
        "אִנּוּן (innun)",
        "הִנּוּן (hinnun)"
      ],
      "correct": 0,
      "explanation": "The Aramaic demonstrative pronoun for 'that' (masculine) is <b>הַהוּא</b> (hahu). It is used to point out a masculine object that is distant from the speaker.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Demonstrative 'That' (Masculine) Examples</h4>\n                    <table>\n                        <tr><th>Demonstrative</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>הַהוּא</td><td>hahu</td><td>הַהוּא גַּבְרָא (hahu gavra) - that man</td></tr>\n                        <tr><td>הַהוּא</td><td>hahu</td><td>הַהוּא סִפְרָא (hahu sifra) - that book</td></tr>\n                        <tr><td>הַהוּא</td><td>hahu</td><td>הַהוּא יוֹמָא (hahu yoma) - that day</td></tr>\n                        <tr><td>הַהוּא</td><td>hahu</td><td>בְּהַהוּא זִמְנָא (b'hahu zimna) - at that time</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Independent Pronouns",
      "question": "What is the Aramaic independent pronoun for 'you' (plural)?",
      "options": [
        "אַנְתּוּן (antun)",
        "אֲנַחְנָא (anakhna)",
        "אִנּוּן (innun)",
        "אַנְתְּ (ant)"
      ],
      "correct": 0,
      "explanation": "The Aramaic demonstrative pronoun for 'that' (feminine) is <b>הַהִיא</b> (hahi). It is used to point out a feminine object that is distant from the speaker.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Demonstrative 'That' (Feminine) Examples</h4>\n                    <table>\n                        <tr><th>Demonstrative</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>הַהִיא</td><td>hahi</td><td>הַהִיא אִתְּתָא (hahi itta) - that woman</td></tr>\n                        <tr><td>הַהִיא</td><td>hahi</td><td>הַהִיא מִלְּתָא (hahi milleta) - that word/matter</td></tr>\n                        <tr><td>הַהִיא</td><td>hahi</td><td>הַהִיא שַׁעֲתָא (hahi sha'ata) - that hour/time</td></tr>\n                        <tr><td>הַהִיא</td><td>hahi</td><td>הַהִיא מְדִינְתָּא (hahi medineta) - that city</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Independent Pronouns",
      "question": "What is the Aramaic independent pronoun for 'they'?",
      "options": [
        "הִנּוּן (hinnun)",
        "אִנּוּן (innun)",
        "אַנְתּוּן (antun)",
        "הוּא וְהִיא (hu ve-hi)"
      ],
      "correct": 1,
      "explanation": "The Aramaic demonstrative pronoun for 'these' is <b>אִלֵּין</b> (illen). It refers to multiple objects that are near to the speaker.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Demonstrative 'These' Examples</h4>\n                    <table>\n                        <tr><th>Demonstrative</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>אִלֵּין</td><td>illen</td><td>אִלֵּין גַּבְרִין (illen gavrin) - these men</td></tr>\n                        <tr><td>אִלֵּין</td><td>illen</td><td>אִלֵּין מִלִּין (illen millin) - these words</td></tr>\n                        <tr><td>אִלֵּין</td><td>illen</td><td>אִלֵּין יוֹמִין (illen yomin) - these days</td></tr>\n                        <tr><td>אִלֵּין</td><td>illen</td><td>מַאן אִלֵּין (man illen) - who are these?</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Demonstratives",
      "question": "What is the Aramaic demonstrative pronoun for 'this' (masculine singular)?",
      "options": [
        "הָדֵין (haden)",
        "דָּא (da)",
        "הָדָא (hada)",
        "אֵלֶּה (elleh)"
      ],
      "correct": 0,
      "explanation": "The Aramaic demonstrative pronoun for 'those' is <b>הַנְּהוֹן</b> (hann'hon). It refers to multiple objects that are distant from the speaker.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Demonstrative 'Those' Examples</h4>\n                    <table>\n                        <tr><th>Demonstrative</th><th>Pronunciation</th><th>Usage Example</th></tr>\n                        <tr><td>הַנְּהוֹן</td><td>hann'hon</td><td>הַנְּהוֹן גַּבְרֵי (hann'hon gavrei) - those men</td></tr>\n                        <tr><td>הַנְּהוֹן</td><td>hann'hon</td><td>הַנְּהוֹן מִלִּין (hann'hon millin) - those words</td></tr>\n                        <tr><td>הַנְּהוֹן</td><td>hann'hon</td><td>הַנְּהוֹן בָּתִּים (hann'hon battim) - those houses</td></tr>\n                        <tr><td>הַנְּהוֹן</td><td>hann'hon</td><td>הַנְּהוֹן יוֹמִין (hann'hon yomin) - those days</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Demonstratives",
      "question": "What is the Aramaic demonstrative pronoun for 'this' (feminine singular)?",
      "options": [
        "הָדֵין (haden)",
        "הָדָא (hada)",
        "אִלֵּין (illen)",
        "דֵּן (den)"
      ],
      "correct": 1,
      "explanation": "The active participle of the verb כת״ב (to write) in Pe'al is <b>כָּתֵב</b> (katev). In Aramaic, participles function like present tense verbs and also as adjectives.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Active Participle Formation in Pe'al</h4>\n                    <table>\n                        <tr><th>Root</th><th>Perfect</th><th>Active Participle</th><th>Meaning</th></tr>\n                        <tr><td>כ.ת.ב</td><td>כְּתַב (ketav)</td><td>כָּתֵב (katev)</td><td>writing/writes</td></tr>\n                        <tr><td>ק.ט.ל</td><td>קְטַל (qetal)</td><td>קָטֵל (qatel)</td><td>killing/kills</td></tr>\n                        <tr><td>א.ז.ל</td><td>אֲזַל (azal)</td><td>אָזֵל (azel)</td><td>going/goes</td></tr>\n                        <tr><td>ש.מ.ע</td><td>שְׁמַע (shema')</td><td>שָׁמֵע (shame')</td><td>hearing/hears</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Demonstratives",
      "question": "What is the Aramaic demonstrative pronoun for 'that' (masculine singular)?",
      "options": [
        "הַהוּא (hahu)",
        "הַהִיא (hahi)",
        "אִנּוּן (innun)",
        "אִלֵּין (illen)"
      ],
      "correct": 0,
      "explanation": "The passive participle of the verb כת״ב (to write) in Pe'al is <b>כְּתִיב</b> (ketiv). It expresses the state resulting from an action being done to something.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Passive Participle Formation in Pe'al</h4>\n                    <table>\n                        <tr><th>Root</th><th>Perfect</th><th>Passive Participle</th><th>Meaning</th></tr>\n                        <tr><td>כ.ת.ב</td><td>כְּתַב (ketav)</td><td>כְּתִיב (ketiv)</td><td>written</td></tr>\n                        <tr><td>ק.ט.ל</td><td>קְטַל (qetal)</td><td>קְטִיל (qetil)</td><td>killed</td></tr>\n                        <tr><td>ש.מ.ע</td><td>שְׁמַע (shema')</td><td>שְׁמִיעַ (shemia')</td><td>heard</td></tr>\n                        <tr><td>ע.ב.ד</td><td>עֲבַד (avad)</td><td>עֲבִיד (avid)</td><td>done/made</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Demonstratives",
      "question": "What is the Aramaic demonstrative pronoun for 'that' (feminine singular)?",
      "options": [
        "הַהִיא (hahi)",
        "הַהוּא (hahu)",
        "אִלֵּין (illen)",
        "הָדֵין (haden)"
      ],
      "correct": 0,
      "explanation": "The active participle of the verb קט״ל (to kill) in the Pa'el binyan is <b>מְקַטֵּל</b> (meqattel). Pa'el participles typically have an intensified meaning compared to Pe'al.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Active Participle Formation in Pa'el</h4>\n                    <table>\n                        <tr><th>Root</th><th>Perfect Pa'el</th><th>Active Participle</th><th>Meaning</th></tr>\n                        <tr><td>ק.ט.ל</td><td>קַטֵּל (qattel)</td><td>מְקַטֵּל (meqattel)</td><td>massacring</td></tr>\n                        <tr><td>ד.ב.ר</td><td>דַּבֵּר (dabber)</td><td>מְדַבֵּר (medabber)</td><td>speaking</td></tr>\n                        <tr><td>ק.ד.ש</td><td>קַדֵּשׁ (qaddesh)</td><td>מְקַדֵּשׁ (meqaddesh)</td><td>sanctifying</td></tr>\n                        <tr><td>ש.ב.ח</td><td>שַׁבַּח (shabbaḥ)</td><td>מְשַׁבַּח (meshabbaḥ)</td><td>praising</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Demonstratives",
      "question": "What is the Aramaic demonstrative pronoun for 'these'?",
      "options": [
        "הָדֵין (haden)",
        "אִלֵּין (illen)",
        "הַהוּא (hahu)",
        "הָדָא (hada)"
      ],
      "correct": 1,
      "explanation": "The passive participle of the verb קט״ל in Itpe'el is <b>מִתְקְטֵל</b> (mitqetel). The Itpe'el is the passive/reflexive form of Pe'al, and its participle reflects this passive meaning.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Passive Participle Formation in Itpe'el</h4>\n                    <table>\n                        <tr><th>Root</th><th>Perfect Itpe'el</th><th>Passive Participle</th><th>Meaning</th></tr>\n                        <tr><td>ק.ט.ל</td><td>אִתְקְטֵל (itqetel)</td><td>מִתְקְטֵל (mitqetel)</td><td>being killed</td></tr>\n                        <tr><td>כ.ת.ב</td><td>אִתְכְּתֵב (itkətev)</td><td>מִתְכְּתֵב (mitkətev)</td><td>being written</td></tr>\n                        <tr><td>א.מ.ר</td><td>אִתְאֲמַר (it'amar)</td><td>מִתְאֲמַר (mit'amar)</td><td>being said</td></tr>\n                        <tr><td>ע.ב.ד</td><td>אִתְעֲבֵד (it'aved)</td><td>מִתְעֲבֵד (mit'aved)</td><td>being done</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Demonstratives",
      "question": "What is the Aramaic demonstrative pronoun for 'those'?",
      "options": [
        "אִלֵּין (illen)",
        "אִנּוּן (innun)",
        "הַנְּהוֹן (hann'hon)",
        "הָדֵין (haden)"
      ],
      "correct": 2,
      "explanation": "The infinitive form of the verb קט״ל (to kill) in Pe'al is <b>מִקְטַל</b> (miqtal). Infinitives in Aramaic are verbal nouns that express the action itself.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Infinitive Formation in Pe'al</h4>\n                    <table>\n                        <tr><th>Root</th><th>Perfect</th><th>Infinitive</th><th>Meaning</th></tr>\n                        <tr><td>ק.ט.ל</td><td>קְטַל (qetal)</td><td>מִקְטַל (miqtal)</td><td>to kill</td></tr>\n                        <tr><td>כ.ת.ב</td><td>כְּתַב (ketav)</td><td>מִכְתַּב (miktav)</td><td>to write</td></tr>\n                        <tr><td>ש.מ.ע</td><td>שְׁמַע (shema')</td><td>מִשְׁמַע (mishma')</td><td>to hear</td></tr>\n                        <tr><td>ע.ב.ד</td><td>עֲבַד (avad)</td><td>מֶעֱבַד (me'evad)</td><td>to do</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Participles",
      "question": "What is the active participle of the verb כת״ב (to write) in Pe'al?",
      "options": [
        "כָּתֵב (katev)",
        "כְּתַב (k'tav)",
        "כְּתִיב (k'tiv)",
        "מִכְתַּב (mikhtav)"
      ],
      "correct": 0,
      "explanation": "The infinitive form of the verb כת״ב (to write) in Pa'el is <b>לְכַתָּבָא</b> (lekattava). Pa'el infinitives are often formed with the prefix ל־ and ending ־ָא, and express intensive forms of action.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Infinitive Formation in Pa'el</h4>\n                    <table>\n                        <tr><th>Root</th><th>Perfect Pa'el</th><th>Infinitive</th><th>Meaning</th></tr>\n                        <tr><td>כ.ת.ב</td><td>כַּתֵּב (kattev)</td><td>לְכַתָּבָא (lekattava)</td><td>to write (intensively)</td></tr>\n                        <tr><td>ק.ט.ל</td><td>קַטֵּל (qattel)</td><td>לְקַטָּלָא (leqattala)</td><td>to massacre</td></tr>\n                        <tr><td>ד.ב.ר</td><td>דַּבֵּר (dabber)</td><td>לְדַבָּרָא (ledabbara)</td><td>to speak</td></tr>\n                        <tr><td>ק.ד.ש</td><td>קַדֵּשׁ (qaddesh)</td><td>לְקַדָּשָׁא (leqaddasha)</td><td>to sanctify</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Participles",
      "question": "What is the passive participle of the verb כת״ב (to write) in Pe'al?",
      "options": [
        "כָּתֵב (katev)",
        "כְּתִיב (ketiv)",
        "מְכַתֵּב (mekattev)",
        "מִתְכְּתֵב (mitkettev)"
      ],
      "correct": 1,
      "explanation": "In the Aramaic sentence 'בָּעֵי לְמֵיכַל' (ba'ei lemeikhal), the infinitive is used as a <b>complement of a finite verb</b>. This construction means 'wants to eat', where the infinitive lemeikhal (to eat) completes the meaning of the verb ba'ei (wants).",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Infinitive Uses in Aramaic</h4>\n                    <table>\n                        <tr><th>Construction</th><th>Transliteration</th><th>Meaning</th><th>Function</th></tr>\n                        <tr><td>בָּעֵי לְמֵיכַל</td><td>ba'ei lemeikhal</td><td>wants to eat</td><td>Complement</td></tr>\n                        <tr><td>בָּעֵי לְמֵיזַל</td><td>ba'ei lemeizal</td><td>wants to go</td><td>Complement</td></tr>\n                        <tr><td>אֲתָא לְמִקְרֵי</td><td>ata lemiqrei</td><td>came to read</td><td>Purpose</td></tr>\n                        <tr><td>לְמֵימַר אָסוּר</td><td>lemeimar asur</td><td>to say is forbidden</td><td>Subject</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Participles",
      "question": "What is the active participle of the verb קט״ל (to kill) in Pa'el?",
      "options": [
        "קָטֵל (qatel)",
        "קַטֵּל (qattel)",
        "מְקַטֵּל (meqattel)",
        "מִתְקַטֵּל (mitqattel)"
      ],
      "correct": 2,
      "explanation": "The Aramaic cardinal number for 'one' (masculine) is <b>חַד</b> (ḥad). This is used when counting or referring to single masculine objects.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Cardinal Number 'One' (Masculine) Usage</h4>\n                    <table>\n                        <tr><th>Number</th><th>Transliteration</th><th>Usage Example</th><th>Meaning</th></tr>\n                        <tr><td>חַד</td><td>ḥad</td><td>חַד גַּבְרָא (ḥad gavra)</td><td>one man</td></tr>\n                        <tr><td>חַד</td><td>ḥad</td><td>חַד יוֹמָא (ḥad yoma)</td><td>one day</td></tr>\n                        <tr><td>חַד</td><td>ḥad</td><td>חַד סִפְרָא (ḥad sifra)</td><td>one book</td></tr>\n                        <tr><td>חַד</td><td>ḥad</td><td>חַד מִנְּהוֹן (ḥad minnehon)</td><td>one of them</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Participles",
      "question": "What is the passive participle of the verb קט״ל (to kill) in Itpe'el?",
      "options": [
        "מְקַטֵּל (meqattel)",
        "מִתְקְטֵל (mitqetel)",
        "קָטֵל (qatel)",
        "קְטִיל (qetil)"
      ],
      "correct": 1,
      "explanation": "The Aramaic cardinal number for 'one' (feminine) is <b>חֲדָא</b> (ḥada). This is used when counting or referring to single feminine objects.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Cardinal Number 'One' (Feminine) Usage</h4>\n                    <table>\n                        <tr><th>Number</th><th>Transliteration</th><th>Usage Example</th><th>Meaning</th></tr>\n                        <tr><td>חֲדָא</td><td>ḥada</td><td>חֲדָא אִתְּתָא (ḥada itta)</td><td>one woman</td></tr>\n                        <tr><td>חֲדָא</td><td>ḥada</td><td>חֲדָא שַׁעֲתָא (ḥada sha'ata)</td><td>one hour</td></tr>\n                        <tr><td>חֲדָא</td><td>ḥada</td><td>חֲדָא מְדִינְתָּא (ḥada medinta)</td><td>one city</td></tr>\n                        <tr><td>חֲדָא</td><td>ḥada</td><td>חֲדָא זִמְנָא (ḥada zimna)</td><td>one time</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Infinitives",
      "question": "What is the infinitive form of the verb קט״ל (to kill) in Pe'al?",
      "options": [
        "מִקְטַל (miqtal)",
        "קָטְלָא (qatla)",
        "קְטֹל (qetol)",
        "קָטֵל (qatel)"
      ],
      "correct": 0,
      "explanation": "The Aramaic cardinal number for 'two' (masculine) is <b>תְּרֵין</b> (trein). This is used when counting or referring to pairs of masculine objects.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Cardinal Number 'Two' (Masculine) Usage</h4>\n                    <table>\n                        <tr><th>Number</th><th>Transliteration</th><th>Usage Example</th><th>Meaning</th></tr>\n                        <tr><td>תְּרֵין</td><td>trein</td><td>תְּרֵין גַּבְרִין (trein gavrin)</td><td>two men</td></tr>\n                        <tr><td>תְּרֵין</td><td>trein</td><td>תְּרֵין יוֹמִין (trein yomin)</td><td>two days</td></tr>\n                        <tr><td>תְּרֵין</td><td>trein</td><td>תְּרֵין סִפְרִין (trein sifrin)</td><td>two books</td></tr>\n                        <tr><td>תְּרֵין</td><td>trein</td><td>תְּרֵין בְּנֵי נָשָׁא (trein b'nei nasha)</td><td>two people</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Infinitives",
      "question": "What is the infinitive form of the verb כת״ב (to write) in Pa'el?",
      "options": [
        "מִכְתַּב (miktav)",
        "כְּתָבָא (ketava)",
        "כַּתּוֹבֵי (kattove)",
        "לְכַתָּבָא (lekattava)"
      ],
      "correct": 3,
      "explanation": "The Aramaic cardinal number for 'two' (feminine) is <b>תַּרְתֵּין</b> (tartein). This is used when counting or referring to pairs of feminine objects.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Cardinal Number 'Two' (Feminine) Usage</h4>\n                    <table>\n                        <tr><th>Number</th><th>Transliteration</th><th>Usage Example</th><th>Meaning</th></tr>\n                        <tr><td>תַּרְתֵּין</td><td>tartein</td><td>תַּרְתֵּין נְשִׁין (tartein n'shin)</td><td>two women</td></tr>\n                        <tr><td>תַּרְתֵּין</td><td>tartein</td><td>תַּרְתֵּין שַׁעֲתִין (tartein sha'atin)</td><td>two hours</td></tr>\n                        <tr><td>תַּרְתֵּין</td><td>tartein</td><td>תַּרְתֵּין מְדִינָן (tartein medinan)</td><td>two cities</td></tr>\n                        <tr><td>תַּרְתֵּין</td><td>tartein</td><td>תַּרְתֵּין אַמּוֹת (tartein ammot)</td><td>two cubits</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Infinitives",
      "question": "How is the infinitive used in this Aramaic sentence: 'בָּעֵי לְמֵיכַל' (ba'ei lemeikhal)?",
      "options": [
        "As an imperative (command)",
        "As a gerund (verbal noun)",
        "As a complement of a finite verb ('wants to eat')",
        "As a present participle"
      ],
      "correct": 2,
      "explanation": "The Aramaic cardinal number for 'three' is <b>תְּלָת/תְּלָתָא</b> (tlat/tlata). The form תְּלָת is typically used with feminine nouns, while תְּלָתָא is used with masculine nouns.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Cardinal Number 'Three' Usage</h4>\n                    <table>\n                        <tr><th>Number</th><th>Grammatical Gender</th><th>Usage Example</th><th>Meaning</th></tr>\n                        <tr><td>תְּלָתָא</td><td>Masculine</td><td>תְּלָתָא גַּבְרִין (tlata gavrin)</td><td>three men</td></tr>\n                        <tr><td>תְּלָתָא</td><td>Masculine</td><td>תְּלָתָא יוֹמִין (tlata yomin)</td><td>three days</td></tr>\n                        <tr><td>תְּלָת</td><td>Feminine</td><td>תְּלָת נְשִׁין (tlat n'shin)</td><td>three women</td></tr>\n                        <tr><td>תְּלָת</td><td>Feminine</td><td>תְּלָת שְׁנִין (tlat sh'nin)</td><td>three years</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Numbers",
      "question": "What is the Aramaic cardinal number for 'one' (masculine)?",
      "options": [
        "חַד (ḥad)",
        "תְּרֵין (trein)",
        "חֲדָא (ḥada)",
        "תְּלָתָא (tlata)"
      ],
      "correct": 0,
      "explanation": "The Aramaic cardinal number for 'ten' is <b>עֲשַׂר/עַסְרָא</b> (asar/asra). The form עֲשַׂר is typically used with feminine nouns, while עַסְרָא is used with masculine nouns.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Cardinal Number 'Ten' Usage</h4>\n                    <table>\n                        <tr><th>Number</th><th>Grammatical Gender</th><th>Usage Example</th><th>Meaning</th></tr>\n                        <tr><td>עַסְרָא</td><td>Masculine</td><td>עַסְרָא גַּבְרִין (asra gavrin)</td><td>ten men</td></tr>\n                        <tr><td>עַסְרָא</td><td>Masculine</td><td>עַסְרָא יוֹמִין (asra yomin)</td><td>ten days</td></tr>\n                        <tr><td>עֲשַׂר</td><td>Feminine</td><td>עֲשַׂר נְשִׁין (asar n'shin)</td><td>ten women</td></tr>\n                        <tr><td>עֲשַׂר</td><td>Feminine</td><td>עֲשַׂר שְׁנִין (asar sh'nin)</td><td>ten years</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Numbers",
      "question": "What is the Aramaic cardinal number for 'one' (feminine)?",
      "options": [
        "חֲדָא (ḥada)",
        "חַד (ḥad)",
        "תְּרֵין (trein)",
        "תַּרְתֵּין (tartein)"
      ],
      "correct": 0,
      "explanation": "In Aramaic, 11 is expressed as <b>חַד עֲשַׂר</b> (ḥad asar) for feminine nouns or <b>חַד עַסְרָא</b> (ḥad asra) for masculine nouns. This literally means 'one ten'.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Formation of 'Eleven' in Aramaic</h4>\n                    <table>\n                        <tr><th>Number</th><th>Grammatical Gender</th><th>Usage Example</th><th>Meaning</th></tr>\n                        <tr><td>חַד עַסְרָא</td><td>Masculine</td><td>חַד עַסְרָא גַּבְרִין (ḥad asra gavrin)</td><td>eleven men</td></tr>\n                        <tr><td>חַד עַסְרָא</td><td>Masculine</td><td>חַד עַסְרָא יוֹמִין (ḥad asra yomin)</td><td>eleven days</td></tr>\n                        <tr><td>חַד עֲשַׂר</td><td>Feminine</td><td>חַד עֲשַׂר נְשִׁין (ḥad asar n'shin)</td><td>eleven women</td></tr>\n                        <tr><td>חַד עֲשַׂר</td><td>Feminine</td><td>חַד עֲשַׂר שְׁנִין (ḥad asar sh'nin)</td><td>eleven years</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Numbers",
      "question": "What is the Aramaic cardinal number for 'two' (masculine)?",
      "options": [
        "תְּרֵין (trein)",
        "תַּרְתֵּין (tartein)",
        "תְּלָת (tlat)",
        "חַד (ḥad)"
      ],
      "correct": 0,
      "explanation": "The typical word order in Talmudic Aramaic is <b>Subject-Verb-Object (SVO)</b>, similar to English. This is different from Biblical Hebrew, which often uses VSO order.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Subject-Verb-Object Order Examples</h4>\n                    <table>\n                        <tr><th>Aramaic</th><th>Word Order</th><th>Translation</th></tr>\n                        <tr><td>גַּבְרָא קָטֵל אַרְיָא</td><td>S-V-O</td><td>The man kills the lion</td></tr>\n                        <tr><td>רַבִּי אָמַר מִלְּתָא</td><td>S-V-O</td><td>The rabbi said a word/thing</td></tr>\n                        <tr><td>אֲנָא חֲזֵינָא לֵיהּ</td><td>S-V-O</td><td>I saw him</td></tr>\n                        <tr><td>תַּלְמִידָא כְּתַב סִפְרָא</td><td>S-V-O</td><td>The student wrote a book</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Numbers",
      "question": "What is the Aramaic cardinal number for 'two' (feminine)?",
      "options": [
        "תַּרְתֵּין (tartein)",
        "תְּרֵין (trein)",
        "תְּלָת (tlat)",
        "אַרְבַּע (arba')"
      ],
      "correct": 0,
      "explanation": "Aramaic typically expresses possession using <b>a prepositional phrase with לְ (l'-)</b>, similar to the English construction 'to/for'. This is different from Hebrew, which often uses the construct state for possession.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Possessive Constructions with ל־</h4>\n                    <table>\n                        <tr><th>Aramaic</th><th>Literal Translation</th><th>English Meaning</th></tr>\n                        <tr><td>סִפְרָא לְגַבְרָא</td><td>The book to-the-man</td><td>The man's book</td></tr>\n                        <tr><td>אִית לֵיהּ בְּרָא</td><td>There is to-him a son</td><td>He has a son</td></tr>\n                        <tr><td>לֵית לִי כַּסְפָּא</td><td>There is not to-me money</td><td>I don't have money</td></tr>\n                        <tr><td>בֵּיתָא לְרַבִּי</td><td>The house to-the-rabbi</td><td>The rabbi's house</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Numbers",
      "question": "What is the Aramaic cardinal number for 'three'?",
      "options": [
        "תְּלָת/תְּלָתָא (tlat/tlata)",
        "אַרְבַּע (arba')",
        "חֲמֵשׁ (ḥamesh)",
        "שִׁית (shit)"
      ],
      "correct": 0,
      "explanation": "Negation in Aramaic is typically expressed using the particle <b>לָא</b> (la), which corresponds to 'not' in English. This particle usually precedes the verb or element being negated.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Negation Examples</h4>\n                    <table>\n                        <tr><th>Affirmative</th><th>Negative Form</th><th>Meaning</th></tr>\n                        <tr><td>אָזֵיל (azeil)</td><td>לָא אָזֵיל (la azeil)</td><td>does not go</td></tr>\n                        <tr><td>אָמַר (amar)</td><td>לָא אָמַר (la amar)</td><td>did not say</td></tr>\n                        <tr><td>יָדַע (yada)</td><td>לָא יָדַע (la yada)</td><td>does not know</td></tr>\n                        <tr><td>חֲזָא (ḥaza)</td><td>לָא חֲזָא (la ḥaza)</td><td>did not see</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Numbers",
      "question": "What is the Aramaic cardinal number for 'ten'?",
      "options": [
        "עֲשַׂר/עַסְרָא (asar/asra)",
        "תִּשְׁעָה (tish'ah)",
        "חַמְשָׁא (ḥamsha)",
        "שִׁיתָא (shita)"
      ],
      "correct": 0,
      "explanation": "Questions in Aramaic are typically formed by using interrogative particles like <b>מִי</b> (mi, 'who') or <b>מָה</b> (mah, 'what'). These particles usually appear at the beginning of the question.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Question Formation Examples</h4>\n                    <table>\n                        <tr><th>Interrogative</th><th>Example</th><th>Meaning</th></tr>\n                        <tr><td>מַאן (man)</td><td>מַאן אָמַר הָכִי? (man amar hakhi?)</td><td>Who said so?</td></tr>\n                        <tr><td>מַאי (mai)</td><td>מַאי טַעְמָא? (mai ta'ama?)</td><td>What is the reason?</td></tr>\n                        <tr><td>הֵיכָא (heikha)</td><td>הֵיכָא אָזֵיל? (heikha azeil?)</td><td>Where is he going?</td></tr>\n                        <tr><td>אֵימַת (eimat)</td><td>אֵימַת אָתֵי? (eimat atei?)</td><td>When is he coming?</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Numbers",
      "question": "How do you say '11' in Aramaic?",
      "options": [
        "חַד עֲשַׂר (ḥad asar)",
        "תְּרֵין עֲשַׂר (trein asar)",
        "עֲשַׂר וְחַד (asar ve-ḥad)",
        "תִּשְׁעָה (tish'ah)"
      ],
      "correct": 0,
      "explanation": "The particle <b>דְּ</b> (de-) in Aramaic serves as both a relative pronoun ('who/which/that') and a genitive marker, linking nouns in a relationship similar to 'of' in English.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Uses of the Particle דְּ</h4>\n                    <table>\n                        <tr><th>Function</th><th>Example</th><th>Meaning</th></tr>\n                        <tr><td>Relative Pronoun</td><td>גַּבְרָא דְּאָתֵי (gavra de-atei)</td><td>The man who comes</td></tr>\n                        <tr><td>Genitive Marker</td><td>סִפְרָא דְּרַבִּי (sifra de-rabbi)</td><td>The book of the rabbi</td></tr>\n                        <tr><td>Subordinator</td><td>אָמַר דְּשַׁפִּיר (amar de-shappir)</td><td>He said that it is good</td></tr>\n                        <tr><td>Purpose</td><td>אָתָא דְּלֵימָא (ata de-leima)</td><td>He came so that he could say</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Syntax",
      "question": "What is the typical word order in Talmudic Aramaic sentences?",
      "options": [
        "Subject-Verb-Object (SVO)",
        "Verb-Subject-Object (VSO)",
        "Subject-Object-Verb (SOV)",
        "Verb-Object-Subject (VOS)"
      ],
      "correct": 0,
      "explanation": "The Aramaic phrase <b>מַאי טַעְמָא</b> (mai ta'ama) means 'what is the reason?' It is commonly used in Talmudic discussions to introduce a question about the rationale behind a statement or ruling.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Usage of מַאי טַעְמָא in Context</h4>\n                    <table>\n                        <tr><th>Phrase</th><th>Context</th><th>Function</th></tr>\n                        <tr><td>מַאי טַעְמָא</td><td>מַאי טַעְמָא דְּרַבִּי</td><td>What is the rabbi's reasoning?</td></tr>\n                        <tr><td>מַאי טַעְמָא</td><td>מַאי טַעְמָא קָאָמַר הָכִי</td><td>Why did he say so?</td></tr>\n                        <tr><td>מַאי טַעְמָא</td><td>מַאי טַעְמָא אָסוּר</td><td>Why is it forbidden?</td></tr>\n                        <tr><td>מַאי טַעְמָא</td><td>מַאי טַעְמָא דְּמִלְּתָא</td><td>What is the reason for this matter?</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Syntax",
      "question": "What structure is commonly used in Aramaic to express possession?",
      "options": [
        "Using a genitive case marking",
        "Using a verb meaning 'to have'",
        "Using a prepositional phrase with לְ (l'-)",
        "Using construct state (status constructus)"
      ],
      "correct": 2,
      "explanation": "The Aramaic phrase <b>תָּא שְׁמַע</b> (ta sh'ma) means 'come and hear', and is used to introduce textual evidence or proof in Talmudic discussions. It signals that a supporting text or teaching is about to be cited.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Usage of תָּא שְׁמַע in Talmudic Discourse</h4>\n                    <table>\n                        <tr><th>Phrase</th><th>Function</th><th>Context</th></tr>\n                        <tr><td>תָּא שְׁמַע</td><td>Introducing evidence</td><td>Presenting a text to support an argument</td></tr>\n                        <tr><td>תָּא שְׁמַע</td><td>Challenging a position</td><td>Offering a text that seems to contradict a position</td></tr>\n                        <tr><td>תָּא שְׁמַע</td><td>Resolving a question</td><td>Bringing definitive proof to settle a debate</td></tr>\n                        <tr><td>תָּא שְׁמַע</td><td>Introducing a baraita or Mishnah</td><td>Citing an authoritative text</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Syntax",
      "question": "In Aramaic, how is negation typically expressed?",
      "options": [
        "Using the prefix אִי- (i-)",
        "Using the particle לָא (la)",
        "Using the suffix לֵית (-leit)",
        "Using the particle בַּר (bar)"
      ],
      "correct": 1,
      "explanation": "The Aramaic phrase <b>מְנָא הָנֵי מִילֵי</b> (mena hanei milei) means 'from where are these matters derived?' It is used when seeking a textual source or scriptural basis for a particular teaching or law.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Usage of מְנָא הָנֵי מִילֵי in Talmudic Reasoning</h4>\n                    <table>\n                        <tr><th>Component</th><th>Meaning</th><th>Function</th></tr>\n                        <tr><td>מְנָא (mena)</td><td>from where</td><td>Asks for the source</td></tr>\n                        <tr><td>הָנֵי (hanei)</td><td>these</td><td>Refers to the teachings under discussion</td></tr>\n                        <tr><td>מִילֵי (milei)</td><td>matters/words</td><td>Refers to the legal statements or principles</td></tr>\n                        <tr><td>Full phrase</td><td>From where are these matters derived?</td><td>Begins a search for scriptural/traditional basis</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Syntax",
      "question": "How are questions formed in Aramaic?",
      "options": [
        "By changing the word order",
        "By adding the prefix הַ- (ha-)",
        "By using question particles like מִי (mi) or מָה (mah)",
        "By raising intonation only"
      ],
      "correct": 2,
      "explanation": "The Aramaic phrase <b>אִיבַּעְיָא לְהוּ</b> (ibba'ya lehu) means 'they inquired/asked', and is used to introduce a question or problem posed in the Talmud, often initiating a new topic of discussion.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Usage of אִיבַּעְיָא לְהוּ in Talmudic Discourse</h4>\n                    <table>\n                        <tr><th>Component</th><th>Meaning</th><th>Function in Discourse</th></tr>\n                        <tr><td>אִיבַּעְיָא (ibba'ya)</td><td>it was asked</td><td>Introduces a question</td></tr>\n                        <tr><td>לְהוּ (lehu)</td><td>to/for them</td><td>Indicates the questioning was collective</td></tr>\n                        <tr><td>אִיבַּעְיָא לְהוּ</td><td>it was asked by them/they inquired</td><td>Introduces a problem requiring resolution</td></tr>\n                        <tr><td>After this phrase</td><td>The actual question follows</td><td>Often followed by debate and resolution</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Syntax",
      "question": "What is the function of the particle דְּ (de-) in Aramaic?",
      "options": [
        "Definite article",
        "Relative pronoun and genitive marker",
        "Interrogative particle",
        "Negative particle"
      ],
      "correct": 1,
      "explanation": "The Aramaic term <b>תֵּיקוּ</b> (teiku) means 'let it stand/remain undecided'. It is used when the Talmud cannot reach a definitive conclusion on a particular question, leaving the matter unresolved.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Usage and Meaning of תֵּיקוּ</h4>\n                    <table>\n                        <tr><th>Origin & Meaning</th><th>Usage Context</th><th>Implications</th></tr>\n                        <tr><td>Acronym for 'תִּשְׁבִּי יְתָרֵץ קוּשְׁיוֹת וּבָעֲיוֹת'</td><td>After unresolved debates</td><td>The matter remains undecided</td></tr>\n                        <tr><td>'The Tishbite (Elijah) will resolve questions and problems'</td><td>When logical arguments are exhausted</td><td>Solution awaits messianic times</td></tr>\n                        <tr><td>Indicates lack of tradition to resolve the issue</td><td>When sources conflict</td><td>Often has practical legal implications</td></tr>\n                        <tr><td>May show deference to future scholars</td><td>When insufficient information exists</td><td>Usually a conservative legal approach follows</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Phrases",
      "question": "What does the Aramaic phrase 'מַאי טַעְמָא' (mai ta'ama) mean?",
      "options": [
        "What is your name?",
        "What is the reason?",
        "Who said this?",
        "Where is it written?"
      ],
      "correct": 1,
      "explanation": "The Babylonian Talmud is written in <b>Eastern Aramaic (Babylonian)</b>, which developed among Jewish communities in Babylonia (modern Iraq) during the Amoraic period (200-500 CE).",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Characteristics of Eastern (Babylonian) Aramaic</h4>\n                    <table>\n                        <tr><th>Feature</th><th>Example</th><th>Comparison with Western Aramaic</th></tr>\n                        <tr><td>Loss of guttural pronunciation</td><td>עַיְינִי instead of עַיִין (eye)</td><td>Western retained gutturals</td></tr>\n                        <tr><td>Distinctive verb forms</td><td>Use of internal passive</td><td>Western used more external passive forms</td></tr>\n                        <tr><td>Persian loanwords</td><td>פַּרְדֵּס (pardes - orchard)</td><td>Western had more Greek loanwords</td></tr>\n                        <tr><td>Special vocabulary</td><td>אַרְעָא (ar'a - land) vs. אַדְמָתָא</td><td>Different terms for common objects</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Phrases",
      "question": "What does the Aramaic phrase 'תָּא שְׁמַע' (ta sh'ma) mean?",
      "options": [
        "Let us pray",
        "Come and hear (introducing textual proof)",
        "Listen carefully",
        "Go in peace"
      ],
      "correct": 1,
      "explanation": "The Jerusalem Talmud is written in <b>Western Aramaic (Palestinian/Galilean)</b>, which was spoken by Jewish communities in the Land of Israel during the Amoraic period (200-500 CE).",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Characteristics of Western (Palestinian) Aramaic</h4>\n                    <table>\n                        <tr><th>Feature</th><th>Example</th><th>Comparison with Eastern Aramaic</th></tr>\n                        <tr><td>Retention of gutturals</td><td>Clear distinction between א, ע, ה, ח</td><td>Eastern lost many guttural distinctions</td></tr>\n                        <tr><td>Greek loanwords</td><td>אַפּוֹתֵּיקִי (appoteiki - store)</td><td>Eastern had more Persian influence</td></tr>\n                        <tr><td>Distinctive plural forms</td><td>־ַיָא (-aya) endings</td><td>Eastern used ־ֵי (-ei) endings more</td></tr>\n                        <tr><td>Different verb patterns</td><td>More preference for pa'el forms</td><td>Eastern had different verbal preferences</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Phrases",
      "question": "What does the Aramaic phrase 'מְנָא הָנֵי מִילֵי' (mena hanei milei) mean?",
      "options": [
        "What are these words?",
        "From where are these matters derived?",
        "Why is this important?",
        "How many are there?"
      ],
      "correct": 1,
      "explanation": "A distinctive feature of Babylonian Aramaic compared to Palestinian Aramaic is the <b>loss of guttural sounds</b>. Babylonian Aramaic speakers had difficulty distinguishing between guttural consonants like א, ע, ה, and ח.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Guttural Sound Changes in Babylonian Aramaic</h4>\n                    <table>\n                        <tr><th>Palestinian Pronunciation</th><th>Babylonian Pronunciation</th><th>Meaning</th></tr>\n                        <tr><td>עַיִין ('ayin)</td><td>עַיְינִי ('ayyini)</td><td>eye</td></tr>\n                        <tr><td>אֲנָא (ana)</td><td>אֲנָא (ana) - same spelling but different pronunciation</td><td>I</td></tr>\n                        <tr><td>הַהוּא (hahu)</td><td>הַהוּא (hahu) - ה pronounced weakly</td><td>that</td></tr>\n                        <tr><td>חַד (ḥad)</td><td>חַד (ḥad) - ח often softened</td><td>one</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Phrases",
      "question": "What does the Aramaic phrase 'אִיבַּעְיָא לְהוּ' (ibba'ya lehu) mean?",
      "options": [
        "They said this",
        "They inquired/asked (introducing a question)",
        "They concluded",
        "They disagreed"
      ],
      "correct": 1,
      "explanation": "The Aramaic word <b>אַפּוֹתֵּיקִי</b> (appoteiki - store/deposit) is a loan word from Greek (ἀποθήκη - apothēkē). Many Greek terms entered Aramaic during the Hellenistic period and remained in use throughout the Talmudic era.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Greek Loanwords in Aramaic</h4>\n                    <table>\n                        <tr><th>Aramaic Word</th><th>Greek Origin</th><th>Meaning</th><th>Usage in Talmud</th></tr>\n                        <tr><td>אַפּוֹתֵּיקִי (appoteiki)</td><td>ἀποθήκη (apothēkē)</td><td>storehouse/deposit</td><td>Legal discussions of property</td></tr>\n                        <tr><td>סַנְהֶדְרִין (sanhedrin)</td><td>συνέδριον (synedrion)</td><td>council/court</td><td>Jewish high court</td></tr>\n                        <tr><td>פִּינְקָס (pinkas)</td><td>πίναξ (pinax)</td><td>writing tablet</td><td>Record-keeping discussions</td></tr>\n                        <tr><td>אַכְסַנְיָא (akhsanya)</td><td>ξενία (xenia)</td><td>hospitality/inn</td><td>Travel and accommodation contexts</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Phrases",
      "question": "What does the Aramaic phrase 'הָא' (ha) often signify in Talmudic discussions?",
      "options": [
        "A question marker",
        "A demonstrative ('this' or 'that')",
        "A negation",
        "A transitional word ('however')"
      ],
      "correct": 1,
      "explanation": "The Aramaic word <b>פַּרְדֵּס</b> (pardes - orchard) is a loan word from Persian (𐎱𐎼𐎭𐎹𐎭𐎠𐎶 - paridaida, meaning 'walled enclosure'). It entered Aramaic during the Persian period and later influenced Hebrew as well.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Persian Loanwords in Aramaic</h4>\n                    <table>\n                        <tr><th>Aramaic Word</th><th>Persian Origin</th><th>Meaning</th><th>Usage in Talmud</th></tr>\n                        <tr><td>פַּרְדֵּס (pardes)</td><td>paridaida</td><td>orchard/garden</td><td>Agricultural and mystical contexts</td></tr>\n                        <tr><td>גִּזְבָּר (gizbar)</td><td>ganzabara</td><td>treasurer</td><td>Temple and community administration</td></tr>\n                        <tr><td>דַּת (dat)</td><td>dāta</td><td>law/religion</td><td>Legal discussions</td></tr>\n                        <tr><td>פַּתְבַּג (patbag)</td><td>patibaga</td><td>delicacy/food</td><td>Dietary discussions</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Phrases",
      "question": "What does the phrase 'תֵּיקוּ' (teiku) mean in Talmudic discussions?",
      "options": [
        "It is forbidden",
        "Let it stand/remain undecided",
        "It is permitted",
        "The law follows this opinion"
      ],
      "correct": 1,
      "explanation": "The Aramaic word <b>לִיבְּלָר</b> (liblar - scribe) is a loan word from Latin (libellarius). Latin terms entered Aramaic during the Roman period, especially in administrative, legal, and commercial contexts.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Latin Loanwords in Aramaic</h4>\n                    <table>\n                        <tr><th>Aramaic Word</th><th>Latin Origin</th><th>Meaning</th><th>Usage in Talmud</th></tr>\n                        <tr><td>לִיבְּלָר (liblar)</td><td>libellarius</td><td>scribe</td><td>Legal document discussions</td></tr>\n                        <tr><td>סִיגְנָא (signa)</td><td>signum</td><td>seal/sign</td><td>Administrative contexts</td></tr>\n                        <tr><td>טַבְלָא (tavla)</td><td>tabula</td><td>board/tablet</td><td>Gaming and writing surfaces</td></tr>\n                        <tr><td>קְלֶנְדָּא (qalenda)</td><td>calendae</td><td>calends (first of month)</td><td>Dating and festival discussions</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Dialectical Variations",
      "question": "Which dialect of Aramaic is used in the Babylonian Talmud?",
      "options": [
        "Western Aramaic",
        "Eastern Aramaic (Babylonian)",
        "Imperial Aramaic",
        "Syriac Aramaic"
      ],
      "correct": 1,
      "explanation": "The Aramaic term <b>קַל וָחוֹמֶר</b> (qal va-ḥomer) refers to the hermeneutical principle of 'inference from minor to major' - a logical argument where what applies in a less important case will certainly apply in a more important one.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Structure of Qal va-ḥomer Argument</h4>\n                    <table>\n                        <tr><th>Component</th><th>Function</th><th>Example</th></tr>\n                        <tr><td>קַל (qal)</td><td>The \"light\" (minor) case</td><td>If ordinary days require X</td></tr>\n                        <tr><td>חוֹמֶר (ḥomer)</td><td>The \"heavy\" (major) case</td><td>Then holy days certainly require X</td></tr>\n                        <tr><td>The inference</td><td>Drawing conclusion from minor to major</td><td>What applies in lesser case must apply in greater case</td></tr>\n                        <tr><td>Limitation (דַּיּוֹ - dayyo)</td><td>The conclusion cannot exceed its premise</td><td>The requirement can't be stricter than in the original case</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Dialectical Variations",
      "question": "Which dialect of Aramaic is used in the Jerusalem Talmud?",
      "options": [
        "Western Aramaic (Palestinian/Galilean)",
        "Eastern Aramaic (Babylonian)",
        "Imperial Aramaic",
        "Egyptian Aramaic"
      ],
      "correct": 0,
      "explanation": "The Aramaic term <b>גְּזֵרָה שָׁוָה</b> (gezera shava) refers to the hermeneutical principle of 'analogy based on verbal similarity' - where two laws that share a common word or phrase can illuminate each other's meaning.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Method of Gezera Shava</h4>\n                    <table>\n                        <tr><th>Component</th><th>Function</th><th>Example</th></tr>\n                        <tr><td>Similar terms</td><td>Identifying same word in two contexts</td><td>Word \"remember\" appears in two commandments</td></tr>\n                        <tr><td>Transferring laws</td><td>Applying laws from one context to another</td><td>Details of observance transfer between contexts</td></tr>\n                        <tr><td>Limitation</td><td>Only applies when tradition supports it</td><td>Cannot be applied arbitrarily to any similar terms</td></tr>\n                        <tr><td>Authority</td><td>Requires traditional basis</td><td>Must have been received as a valid comparison</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Dialectical Variations",
      "question": "What is a distinctive feature of Babylonian Aramaic compared to Palestinian Aramaic?",
      "options": [
        "Loss of guttural sounds",
        "More Greek loanwords",
        "Retention of final nun",
        "Simpler grammar"
      ],
      "correct": 0,
      "explanation": "The Aramaic term <b>הֶקֵּשׁ</b> (heqqesh) refers to the hermeneutical principle of 'context-based interpretation' - where laws that appear together in the Torah are understood to inform one another.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Application of Heqqesh</h4>\n                    <table>\n                        <tr><th>Element</th><th>Function</th><th>Example</th></tr>\n                        <tr><td>Textual Proximity</td><td>Laws appearing in same verse/passage</td><td>Two commandments mentioned together</td></tr>\n                        <tr><td>Logical Connection</td><td>Establishing relationship between concepts</td><td>Laws grouped by common theme</td></tr>\n                        <tr><td>Legal Transfer</td><td>Applying rules from one subject to another</td><td>Requirements that apply to one apply to the other</td></tr>\n                        <tr><td>Limitation</td><td>Cannot contradict explicit teachings</td><td>Only fills in details not specified elsewhere</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Loan Words",
      "question": "Which of these Aramaic words is a loan word from Greek?",
      "options": [
        "סוּס (sus - horse)",
        "סִפְרָא (sifra - book)",
        "אַפּוֹתֵּיקִי (appoteiki - store/deposit)",
        "תַּלְמִיד (talmid - student)"
      ],
      "correct": 2,
      "explanation": "The Aramaic term <b>סְבָרָא</b> (sevara) refers to 'logical reasoning' - the application of human logic and rational thought to interpret and extend the law in cases where explicit textual guidance is lacking.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Application of Sevara in Talmudic Reasoning</h4>\n                    <table>\n                        <tr><th>Aspect</th><th>Function</th><th>Example in Talmud</th></tr>\n                        <tr><td>Gap-filling</td><td>Addressing cases not explicitly covered</td><td>\"It stands to reason that...\"</td></tr>\n                        <tr><td>Common sense</td><td>Applying logical principles</td><td>\"Would it enter your mind that...\"</td></tr>\n                        <tr><td>Rationale discovery</td><td>Uncovering reasons for laws</td><td>\"What is the reason? Because...\"</td></tr>\n                        <tr><td>Limits</td><td>Cannot override explicit teaching</td><td>\"Despite logical arguments, the law is...\"</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Loan Words",
      "question": "Which of these Aramaic words is a loan word from Persian?",
      "options": [
        "פַּרְדֵּס (pardes - orchard)",
        "מִדְרָשׁ (midrash - exposition)",
        "תְּפִלָּה (tefilla - prayer)",
        "חָכָם (ḥakham - sage)"
      ],
      "correct": 0,
      "explanation": "The term <b>מתניתין</b> (matnitin) in the Babylonian Talmud refers to 'the Mishnah being discussed' - the specific passage of Mishnah text that serves as the basis for the current Talmudic discussion.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Role of Matnitin in Talmudic Structure</h4>\n                    <table>\n                        <tr><th>Function</th><th>Relationship</th><th>Example Usage</th></tr>\n                        <tr><td>Primary text</td><td>Core legal statement</td><td>\"Our Mishnah states...\"</td></tr>\n                        <tr><td>Discussion basis</td><td>Starting point for analysis</td><td>\"On what is our Mishnah based?\"</td></tr>\n                        <tr><td>Contrasting text</td><td>Compared with other teachings</td><td>\"Our Mishnah contradicts...\"</td></tr>\n                        <tr><td>Authority marker</td><td>Indicates authoritative teaching</td><td>\"The ruling follows our Mishnah\"</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Loan Words",
      "question": "Which of these Aramaic words is a loan word from Latin?",
      "options": [
        "לִיבְּלָר (liblar - scribe)",
        "תַּנָּא (tanna - teacher)",
        "אַבָּא (abba - father)",
        "מַלְכָּא (malka - king)"
      ],
      "correct": 0,
      "explanation": "The term <b>גמרא</b> (gemara) refers to 'the commentary on the Mishnah' - the expansive discussions, debates, and analyses of the Amoraim (Talmudic sages) explaining and extending the Mishnah's teachings.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Components of the Gemara</h4>\n                    <table>\n                        <tr><th>Element</th><th>Function</th><th>Example</th></tr>\n                        <tr><td>Questions</td><td>Probing the Mishnah's meaning</td><td>\"From where do we derive this?\"</td></tr>\n                        <tr><td>Debate</td><td>Recording differing opinions</td><td>\"Rav says X, but Shmuel says Y\"</td></tr>\n                        <tr><td>Sources</td><td>Bringing supporting texts</td><td>\"Come and hear...\"</td></tr>\n                        <tr><td>Rulings</td><td>Determining practical law</td><td>\"The halakhah follows X\"</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Hermeneutics",
      "question": "What is the Aramaic term for 'inference from minor to major'?",
      "options": [
        "גְּזֵרָה שָׁוָה (gezera shava)",
        "קַל וָחוֹמֶר (qal va-ḥomer)",
        "הֶקֵּשׁ (heqqesh)",
        "סְבָרָא (sevara)"
      ],
      "correct": 1,
      "explanation": "The term <b>ברייתא</b> (baraita) refers to 'Tannaitic teachings not included in the Mishnah' - authoritative traditions from the Tannaitic period (1st-2nd century CE) that were not incorporated into Rabbi Judah's Mishnah compilation.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Role of Baraitot in Talmudic Discourse</h4>\n                    <table>\n                        <tr><th>Function</th><th>Relationship to Mishnah</th><th>Introduction Formula</th></tr>\n                        <tr><td>Supplementing</td><td>Adding details omitted from Mishnah</td><td>\"Our Rabbis taught (תנו רבנן)...\"</td></tr>\n                        <tr><td>Challenging</td><td>Presenting alternative rulings</td><td>\"It was taught (תניא)...\"</td></tr>\n                        <tr><td>Clarifying</td><td>Explaining Mishnaic passages</td><td>\"As it was taught...\"</td></tr>\n                        <tr><td>Harmonizing</td><td>Reconciling apparent contradictions</td><td>\"One [source] taught...another taught...\"</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Hermeneutics",
      "question": "What is the Aramaic term for 'analogy based on verbal similarity'?",
      "options": [
        "גְּזֵרָה שָׁוָה (gezera shava)",
        "קַל וָחוֹמֶר (qal va-ḥomer)",
        "הֶקֵּשׁ (heqqesh)",
        "בִּנְיָן אָב (binyan av)"
      ],
      "correct": 0,
      "explanation": "The term <b>תוספתא</b> (tosefta) refers to 'a supplement to the Mishnah' - a collection of Tannaitic traditions compiled around the same time as the Mishnah that expands upon and complements Mishnaic material.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Characteristics of the Tosefta</h4>\n                    <table>\n                        <tr><th>Aspect</th><th>Relationship to Mishnah</th><th>Function</th></tr>\n                        <tr><td>Structure</td><td>Organized parallel to Mishnah</td><td>Follows same order of tractates/chapters</td></tr>\n                        <tr><td>Content</td><td>Supplementary and explanatory</td><td>Provides additional cases and rulings</td></tr>\n                        <tr><td>Authority</td><td>Secondary to Mishnah</td><td>Used to interpret Mishnaic passages</td></tr>\n                        <tr><td>Attribution</td><td>Contains more attributed statements</td><td>Often preserves names of authorities</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Hermeneutics",
      "question": "What is the Aramaic term for 'context-based interpretation'?",
      "options": [
        "הֶקֵּשׁ (heqqesh)",
        "סְבָרָא (sevara)",
        "קַל וָחוֹמֶר (qal va-ḥomer)",
        "גְּזֵרָה שָׁוָה (gezera shava)"
      ],
      "correct": 0,
      "explanation": "The term <b>מדרש</b> (midrash) refers to 'interpretive exposition of biblical texts' - the methodology and resulting literature that interprets Scripture through close reading, wordplay, and creative exegesis.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Types of Midrashic Interpretation</h4>\n                    <table>\n                        <tr><th>Type</th><th>Focus</th><th>Example Works</th></tr>\n                        <tr><td>Midrash Halakhah</td><td>Legal interpretation</td><td>Mekhilta, Sifra, Sifrei</td></tr>\n                        <tr><td>Midrash Aggadah</td><td>Narrative/ethical interpretation</td><td>Bereishit Rabbah, Vayikra Rabbah</td></tr>\n                        <tr><td>Exegetical</td><td>Verse-by-verse commentary</td><td>Midrash Tehillim</td></tr>\n                        <tr><td>Homiletical</td><td>Sermon-style teachings</td><td>Pesikta, Tanchuma</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Hermeneutics",
      "question": "What is the Aramaic term for 'logical reasoning'?",
      "options": [
        "סְבָרָא (sevara)",
        "דְּרָשָׁא (derasha)",
        "קַל וָחוֹמֶר (qal va-ḥomer)",
        "הֶקֵּשׁ (heqqesh)"
      ],
      "correct": 0,
      "explanation": "The term <b>הלכה</b> (halakhah) refers to 'Jewish religious law' - the legal component of Jewish tradition that governs all aspects of life, including ritual, ethics, and interpersonal relationships.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Categories of Halakhah</h4>\n                    <table>\n                        <tr><th>Category</th><th>Focus</th><th>Examples</th></tr>\n                        <tr><td>Ritual law</td><td>Religious practices</td><td>Prayer, Sabbath, holidays, kashrut</td></tr>\n                        <tr><td>Civil law</td><td>Interpersonal relations</td><td>Business, damages, property</td></tr>\n                        <tr><td>Family law</td><td>Domestic matters</td><td>Marriage, divorce, inheritance</td></tr>\n                        <tr><td>Criminal law</td><td>Prohibitions and punishments</td><td>Court procedures, testimony, penalties</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Literature",
      "question": "What does the term 'מתניתין' (matnitin) refer to in the Talmud?",
      "options": [
        "A rabbinical interpretation",
        "The Mishnah being discussed",
        "A dissenting opinion",
        "A legal ruling"
      ],
      "correct": 1,
      "explanation": "The term <b>אגדה</b> (aggadah) refers to 'narrative and non-legal portions of the Talmud' - the sections containing stories, parables, ethics, theology, and other non-legal material that complements the legal discussions.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Elements of Aggadah</h4>\n                    <table>\n                        <tr><th>Type</th><th>Content</th><th>Function</th></tr>\n                        <tr><td>Narratives</td><td>Stories about sages and biblical figures</td><td>Exemplify values and principles</td></tr>\n                        <tr><td>Parables</td><td>Metaphorical stories with moral lessons</td><td>Illustrate abstract concepts</td></tr>\n                        <tr><td>Ethics</td><td>Moral teachings and guidance</td><td>Direct personal conduct</td></tr>\n                        <tr><td>Theology</td><td>Ideas about God and spirituality</td><td>Develop religious thought</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Literature",
      "question": "What does the term 'גמרא' (gemara) refer to in the Talmud?",
      "options": [
        "The commentary on the Mishnah",
        "The collection of legal decisions",
        "The introductory material",
        "The concluding summaries"
      ],
      "correct": 0,
      "explanation": "The Aramaic term <b>פּוֹעַל</b> (po'al) means 'verb' - a word expressing an action, occurrence, or state of being. In grammatical discussions, this term identifies words functioning as verbs in a sentence.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Types of Verbs in Aramaic</h4>\n                    <table>\n                        <tr><th>Category</th><th>Function</th><th>Examples</th></tr>\n                        <tr><td>Action verbs</td><td>Express physical actions</td><td>כְּתַב (wrote), אֲזַל (went)</td></tr>\n                        <tr><td>Stative verbs</td><td>Express states of being</td><td>יְתֵב (sat/dwelled), דְּמֵךְ (slept)</td></tr>\n                        <tr><td>Auxiliary verbs</td><td>Help form complex expressions</td><td>הֲוָה (was/became), אִית (there is)</td></tr>\n                        <tr><td>Modal verbs</td><td>Express possibility/necessity</td><td>בָּעֵי (wants/needs), יָכֵיל (can/able)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Literature",
      "question": "What does the term 'ברייתא' (baraita) refer to in the Talmud?",
      "options": [
        "Tannaitic teachings not included in the Mishnah",
        "The concluding legal decision",
        "The opening statement of a discussion",
        "A prayer recited before study"
      ],
      "correct": 0,
      "explanation": "The Aramaic term <b>שֵׁם</b> (shem) means 'noun' - a word identifying a person, place, thing, quality, or action. In grammatical discussions, this term identifies words functioning as nouns in a sentence.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Types of Nouns in Aramaic</h4>\n                    <table>\n                        <tr><th>Category</th><th>Function</th><th>Examples</th></tr>\n                        <tr><td>Common nouns</td><td>Name general entities</td><td>גַּבְרָא (man), בֵּיתָא (house)</td></tr>\n                        <tr><td>Proper nouns</td><td>Name specific entities</td><td>יְרוּשְׁלֵם (Jerusalem), אַבָּיֵי (Abbaye)</td></tr>\n                        <tr><td>Abstract nouns</td><td>Name concepts/qualities</td><td>חָכְמָתָא (wisdom), טְיבוּתָא (goodness)</td></tr>\n                        <tr><td>Collective nouns</td><td>Name groups</td><td>עַמָּא (people), קְהָלָא (congregation)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Literature",
      "question": "What does the term 'תוספתא' (tosefta) refer to in Talmudic literature?",
      "options": [
        "A supplement to the Mishnah",
        "The Aramaic translation of the Torah",
        "A collection of mystical teachings",
        "The concluding prayer of study"
      ],
      "correct": 0,
      "explanation": "The Aramaic term <b>תּוֹאַר</b> (to'ar) means 'adjective' - a word that modifies or describes a noun by indicating qualities or attributes. In grammatical discussions, this term identifies words functioning as adjectives in a sentence.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Adjective Usage in Aramaic</h4>\n                    <table>\n                        <tr><th>Function</th><th>Position</th><th>Examples</th></tr>\n                        <tr><td>Attribution</td><td>Following the noun</td><td>גַּבְרָא רַבָּא (great man)</td></tr>\n                        <tr><td>Predication</td><td>Connected by copula</td><td>גַּבְרָא הוּא רַבָּא (the man is great)</td></tr>\n                        <tr><td>Agreement</td><td>Matches gender and number</td><td>גַּבְרָא רַבָּא/אִתְּתָא רַבְּתָא</td></tr>\n                        <tr><td>Substantivation</td><td>Functions as noun</td><td>רַבָּא (the great one)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Literature",
      "question": "What does the term 'מדרש' (midrash) refer to in Talmudic literature?",
      "options": [
        "Interpretive exposition of biblical texts",
        "A collection of legal decisions",
        "The Aramaic translation of the Torah",
        "The basic oral law"
      ],
      "correct": 0,
      "explanation": "The Aramaic term <b>מִלַּת יַחַס</b> (millat yaḥas) means 'preposition' - a word that shows the relationship between a noun or pronoun and other words in a sentence, typically indicating position, direction, time, or manner.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Common Aramaic Prepositions</h4>\n                    <table>\n                        <tr><th>Preposition</th><th>Meaning</th><th>Example Usage</th></tr>\n                        <tr><td>בְּ־ (b'-)</td><td>in, at, by, with</td><td>בְּבֵיתָא (in the house)</td></tr>\n                        <tr><td>לְ־ (l'-)</td><td>to, for, toward</td><td>לְגַבְרָא (to/for the man)</td></tr>\n                        <tr><td>מִן (min)</td><td>from, out of</td><td>מִן בֵּיתָא (from the house)</td></tr>\n                        <tr><td>עַל ('al)</td><td>on, upon, about</td><td>עַל פָּתוֹרָא (on the table)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Literature",
      "question": "What does the term 'הלכה' (halakha) refer to in Talmudic literature?",
      "options": [
        "Jewish religious law",
        "Narrative sections of the Talmud",
        "Ethical teachings",
        "Historical accounts"
      ],
      "correct": 0,
      "explanation": "The Aramaic term <b>כִּנּוּי</b> (kinnui) means 'pronoun' - a word that substitutes for a noun or noun phrase. In grammatical discussions, this term identifies words that stand in place of specific nouns.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Types of Pronouns in Aramaic</h4>\n                    <table>\n                        <tr><th>Type</th><th>Function</th><th>Examples</th></tr>\n                        <tr><td>Personal</td><td>Refer to specific persons</td><td>אֲנָא (I), הוּא (he), אִנּוּן (they)</td></tr>\n                        <tr><td>Demonstrative</td><td>Point to specific entities</td><td>הָדֵין (this), הַהוּא (that)</td></tr>\n                        <tr><td>Interrogative</td><td>Form questions</td><td>מַאן (who), מַאי (what)</td></tr>\n                        <tr><td>Relative</td><td>Connect clauses</td><td>דְּ־ (that, who)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Literature",
      "question": "What does the term 'אגדה' (aggadah) refer to in Talmudic literature?",
      "options": [
        "Narrative and non-legal portions of the Talmud",
        "Legal discussions and rulings",
        "Mystical interpretations",
        "Rules of grammar"
      ],
      "correct": 0,
      "explanation": "The Aramaic term <b>שֵׁם פֹּעַל</b> (shem po'al) means 'adverb' - a word that modifies a verb, adjective, or another adverb, expressing manner, place, time, or degree.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Types of Adverbs in Aramaic</h4>\n                    <table>\n                        <tr><th>Type</th><th>Function</th><th>Examples</th></tr>\n                        <tr><td>Manner</td><td>How an action is performed</td><td>שַׁפִּיר (well), מְהֵירָא (quickly)</td></tr>\n                        <tr><td>Place</td><td>Where an action occurs</td><td>הָכָא (here), הָתַם (there)</td></tr>\n                        <tr><td>Time</td><td>When an action occurs</td><td>הַשְׁתָּא (now), יוֹמָא (today)</td></tr>\n                        <tr><td>Degree</td><td>Intensity of action</td><td>טְפֵי (more), בִּלְחוֹד (only)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Grammatical Terms",
      "question": "What is the Aramaic term for 'verb'?",
      "options": [
        "מִלָּה (millah)",
        "פּוֹעַל (po'al)",
        "שֵׁם (shem)",
        "מַאֲמָר (ma'amar)"
      ],
      "correct": 1,
      "explanation": "The Aramaic term <b>מִלַּת חִבּוּר</b> (millat ḥibbur) means 'conjunction' - a word that connects clauses, sentences, phrases, or words within a sentence.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Types of Conjunctions in Aramaic</h4>\n                    <table>\n                        <tr><th>Type</th><th>Function</th><th>Examples</th></tr>\n                        <tr><td>Coordinating</td><td>Connect equal elements</td><td>וְ־ (and), אוֹ (or)</td></tr>\n                        <tr><td>Subordinating</td><td>Connect dependent clauses</td><td>דְּ־ (that), כַּד (when)</td></tr>\n                        <tr><td>Correlative</td><td>Work in pairs</td><td>אִי...אוֹ (either...or)</td></tr>\n                        <tr><td>Adversative</td><td>Show contrast</td><td>אֶלָּא (but), בְּרַם (however)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Grammatical Terms",
      "question": "What is the Aramaic term for 'noun'?",
      "options": [
        "שֵׁם (shem)",
        "מִלָּה (millah)",
        "פּוֹעַל (po'al)",
        "תּוֹאַר (to'ar)"
      ],
      "correct": 0,
      "explanation": "The suffix <b>־ָן</b> (-an) in Aramaic typically forms adjectives from nouns. This productive suffix creates words that describe characteristics or qualities related to the base noun.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Adjective Formation with -an Suffix</h4>\n                    <table>\n                        <tr><th>Base Noun</th><th>Derived Adjective</th><th>Meaning</th></tr>\n                        <tr><td>רַחֲמָא (mercy)</td><td>רַחֲמָן (merciful)</td><td>Having the quality of mercy</td></tr>\n                        <tr><td>חַמְרָא (wine)</td><td>חַמְרָן (drinker of wine)</td><td>Characterized by wine drinking</td></tr>\n                        <tr><td>שִׁקְרָא (lie)</td><td>שַׁקְרָן (liar)</td><td>Characterized by lying</td></tr>\n                        <tr><td>כַּפְנָא (hunger)</td><td>כַּפְנָן (hungry)</td><td>Experiencing hunger</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Grammatical Terms",
      "question": "What is the Aramaic term for 'adjective'?",
      "options": [
        "תּוֹאַר (to'ar)",
        "מִלָּה (millah)",
        "שֵׁם (shem)",
        "אוֹת (ot)"
      ],
      "correct": 0,
      "explanation": "The suffix <b>־וּ</b> (-u) in Aramaic verbs marks third-person masculine plural form. This suffix identifies actions performed by multiple male subjects ('they').",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Third-Person Masculine Plural Verb Forms</h4>\n                    <table>\n                        <tr><th>Singular Form</th><th>Plural with -u</th><th>Meaning</th></tr>\n                        <tr><td>כְּתַב (ketav)</td><td>כְּתַבוּ (ketavu)</td><td>they wrote</td></tr>\n                        <tr><td>אֲמַר (amar)</td><td>אֲמַרוּ (amaru)</td><td>they said</td></tr>\n                        <tr><td>עֲבַד (avad)</td><td>עֲבַדוּ (avadu)</td><td>they did</td></tr>\n                        <tr><td>יְתֵיב (yetiv)</td><td>יְתִיבוּ (yetivu)</td><td>they sat</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Grammatical Terms",
      "question": "What is the Aramaic term for 'preposition'?",
      "options": [
        "מִלַּת יַחַס (millat yaḥas)",
        "מִלָּה (millah)",
        "שֵׁם פֹּעַל (shem po'al)",
        "כִּנּוּי (kinnui)"
      ],
      "correct": 0,
      "explanation": "The suffix <b>־וּת</b> (-ut) in Aramaic forms abstract nouns from concrete nouns, adjectives, or verbs. This suffix creates words that express concepts, qualities, or states of being.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Abstract Noun Formation with -ut Suffix</h4>\n                    <table>\n                        <tr><th>Base Word</th><th>Abstract Noun</th><th>Meaning</th></tr>\n                        <tr><td>מֶלֶךְ (king)</td><td>מַלְכוּת (malkut)</td><td>kingship/kingdom</td></tr>\n                        <tr><td>רַב (master)</td><td>רַבּוּת (rabut)</td><td>mastery/greatness</td></tr>\n                        <tr><td>גְּבַר (man)</td><td>גַּבְרוּת (gavrut)</td><td>manliness/strength</td></tr>\n                        <tr><td>טַב (good)</td><td>טִיבוּת (tivut)</td><td>goodness/kindness</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Grammatical Terms",
      "question": "What is the Aramaic term for 'pronoun'?",
      "options": [
        "כִּנּוּי (kinnui)",
        "שֵׁם גּוּף (shem guf)",
        "מִלַּת גּוּף (millat guf)",
        "רְמִיזָה (remiza)"
      ],
      "correct": 0,
      "explanation": "The prefix <b>מְ־</b> (me-) in Aramaic typically forms participles from verbs. This prefix creates present-tense verb forms and agent nouns indicating the doer of an action.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Participle Formation with me- Prefix</h4>\n                    <table>\n                        <tr><th>Verb Root</th><th>Participle with me-</th><th>Meaning</th></tr>\n                        <tr><td>כ.ת.ב (write)</td><td>מְכַתֵּב (mekatev)</td><td>writing/writer (Pa'el)</td></tr>\n                        <tr><td>ק.ט.ל (kill)</td><td>מְקַטֵּל (meqatel)</td><td>killing/killer (Pa'el)</td></tr>\n                        <tr><td>ל.מ.ד (learn)</td><td>מְלַמֵּד (melamed)</td><td>teaching/teacher (Pa'el)</td></tr>\n                        <tr><td>ד.ב.ר (speak)</td><td>מְדַבֵּר (medaber)</td><td>speaking/speaker (Pa'el)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Grammatical Terms",
      "question": "What is the Aramaic term for 'adverb'?",
      "options": [
        "מִלַּת פֹּעַל (millat po'al)",
        "תּוֹסֶפֶת (tosefet)",
        "שֵׁם פֹּעַל (shem po'al)",
        "מִלַּת טַעַם (millat ta'am)"
      ],
      "correct": 2,
      "explanation": "The prefix <b>אַ־</b> (a-) in Aramaic forms causative verbs in the Af'el binyan. This prefix transforms a basic verb into one expressing causation - making something happen.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Causative Formation with a- Prefix</h4>\n                    <table>\n                        <tr><th>Basic Verb (Pe'al)</th><th>Causative (Af'el)</th><th>Meaning Change</th></tr>\n                        <tr><td>יְדַע (yeda') - know</td><td>אוֹדַע (oda') - inform</td><td>know → make known</td></tr>\n                        <tr><td>עָל ('al) - enter</td><td>אַעֵיל (a'eil) - bring in</td><td>enter → cause to enter</td></tr>\n                        <tr><td>נְפַק (nefaq) - go out</td><td>אַפֵּיק (appeiq) - bring out</td><td>exit → cause to exit</td></tr>\n                        <tr><td>שְׁתֵי (shtei) - drink</td><td>אַשְׁקֵי (ashqei) - give drink</td><td>drink → cause to drink</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Grammatical Terms",
      "question": "What is the Aramaic term for 'conjunction'?",
      "options": [
        "מִלַּת חִבּוּר (millat ḥibbur)",
        "קַשָּׁר (qashshar)",
        "מִלַּת קִשּׁוּר (millat qishshur)",
        "מְחַבֵּר (meḥabber)"
      ],
      "correct": 0,
      "explanation": "The prefix <b>אִת־</b> (it-) in Aramaic forms reflexive/passive verbs. This prefix transforms an active verb into one where the subject either receives the action or performs it on oneself.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Reflexive/Passive Formation with it- Prefix</h4>\n                    <table>\n                        <tr><th>Active Form</th><th>Reflexive/Passive</th><th>Meaning Change</th></tr>\n                        <tr><td>כְּתַב (ketav) - wrote</td><td>אִתְכְּתֵב (itkətev)</td><td>wrote → was written</td></tr>\n                        <tr><td>קְטַל (qetal) - killed</td><td>אִתְקְטֵל (itqetel)</td><td>killed → was killed</td></tr>\n                        <tr><td>אֲמַר (amar) - said</td><td>אִתְאֲמַר (it'amar)</td><td>said → was said</td></tr>\n                        <tr><td>חֲזָא (ḥaza) - saw</td><td>אִתְחֲזֵי (itḥazei)</td><td>saw → was seen/appeared</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Suffixes",
      "question": "What is the function of the suffix ־ָן (-an) in Aramaic?",
      "options": [
        "Forms adjectives from nouns",
        "Indicates direction",
        "Forms abstract nouns",
        "Creates diminutives"
      ],
      "correct": 0,
      "explanation": "The prefix <b>בְּ־</b> (be-) in Aramaic indicates 'in/at/by' (locative/instrumental). This prefix shows location, time, or means by which an action is performed.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Uses of the be- Prefix</h4>\n                    <table>\n                        <tr><th>Function</th><th>Example</th><th>Meaning</th></tr>\n                        <tr><td>Locative</td><td>בְּבֵיתָא (b'veita)</td><td>in the house</td></tr>\n                        <tr><td>Temporal</td><td>בְּשַׁבְּתָא (b'shabbəta)</td><td>on the Sabbath</td></tr>\n                        <tr><td>Instrumental</td><td>בִּידָא (bida)</td><td>with/by the hand</td></tr>\n                        <tr><td>Manner</td><td>בִּזְהִירוּ (bizhiru)</td><td>with caution</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Suffixes",
      "question": "What is the function of the suffix ־וּ (-u) in Aramaic verbs?",
      "options": [
        "Marks third-person masculine plural",
        "Indicates first-person singular",
        "Forms passive participles",
        "Creates imperative forms"
      ],
      "correct": 0,
      "explanation": "The Aramaic conjunction <b>וְ־</b> (ve-) is equivalent to 'and' in English. This is the primary coordinating conjunction, used to connect words, phrases, clauses, or sentences.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Uses of the ve- Conjunction</h4>\n                    <table>\n                        <tr><th>Function</th><th>Example</th><th>Meaning</th></tr>\n                        <tr><td>Joining nouns</td><td>שִׁמְעוֹן וִיהוּדָה</td><td>Simon and Judah</td></tr>\n                        <tr><td>Joining verbs</td><td>אֲזַל וַאֲתָא</td><td>he went and came</td></tr>\n                        <tr><td>Joining clauses</td><td>אֲמַר וְלָא שָׁמְעוּ</td><td>he said and they did not listen</td></tr>\n                        <tr><td>Sequential</td><td>וַהֲוָה כַּד שְׁמַע</td><td>and it happened when he heard</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Suffixes",
      "question": "What is the function of the suffix ־וּת (-ut) in Aramaic?",
      "options": [
        "Forms abstract nouns",
        "Indicates plural nouns",
        "Creates adjectives",
        "Marks possession"
      ],
      "correct": 0,
      "explanation": "The Aramaic connective <b>כְּדֵי</b> (kedei) expresses purpose ('in order that'). This conjunction introduces a subordinate clause that explains the purpose or intention behind the action in the main clause.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Purpose Expressions with kedei</h4>\n                    <table>\n                        <tr><th>Construction</th><th>Example</th><th>Meaning</th></tr>\n                        <tr><td>כְּדֵי + infinitive</td><td>כְּדֵי לְמֵיכַל</td><td>in order to eat</td></tr>\n                        <tr><td>כְּדֵי דְּ + verb</td><td>כְּדֵי דְּלֵיכוּל</td><td>in order that he may eat</td></tr>\n                        <tr><td>כְּדֵי שֶׁ + clause</td><td>כְּדֵי שֶׁיֵּיכְלוּן</td><td>so that they might eat</td></tr>\n                        <tr><td>With negation</td><td>כְּדֵי דְּלָא</td><td>in order that...not (to prevent)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Prefixes",
      "question": "What is the function of the prefix מְ־ (me-) in Aramaic?",
      "options": [
        "Forms participles from verbs",
        "Indicates location",
        "Creates comparative adjectives",
        "Marks interrogative sentences"
      ],
      "correct": 0,
      "explanation": "The Aramaic connective <b>אוֹ</b> (o) is equivalent to 'or' in English. This disjunctive conjunction presents alternatives or options between words, phrases, or clauses.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Uses of the o Conjunction</h4>\n                    <table>\n                        <tr><th>Function</th><th>Example</th><th>Meaning</th></tr>\n                        <tr><td>Simple alternatives</td><td>יוֹמָא אוֹ לֵילְיָא</td><td>day or night</td></tr>\n                        <tr><td>Legal options</td><td>לִקְנוֹת אוֹ לִמְכּוֹר</td><td>to buy or to sell</td></tr>\n                        <tr><td>Multiple choices</td><td>חַד אוֹ תְּרֵין אוֹ תְּלָתָא</td><td>one or two or three</td></tr>\n                        <tr><td>Exclusive options</td><td>חַיָּב אוֹ זַכַּאי</td><td>guilty or innocent</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Prefixes",
      "question": "What is the function of the prefix אַ־ (a-) in Aramaic?",
      "options": [
        "Forms causative verbs (Af'el)",
        "Indicates negation",
        "Creates plural nouns",
        "Marks interrogative sentences"
      ],
      "correct": 0,
      "explanation": "The Aramaic phrase <b>אַף עַל גַּב דְּ</b> (af al gav de-) expresses concession ('although/even though'). This conjunction introduces a fact that makes the main clause surprising or unexpected.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Concessive Constructions</h4>\n                    <table>\n                        <tr><th>Form</th><th>Example</th><th>Meaning</th></tr>\n                        <tr><td>אַף עַל גַּב דְּ + verb</td><td>אַף עַל גַּב דַּאֲמַר</td><td>even though he said</td></tr>\n                        <tr><td>Shortened form אַף עַל פִּי</td><td>אַף עַל פִּי דְּשָׁמַע</td><td>although he heard</td></tr>\n                        <tr><td>In contrast structure</td><td>אַף עַל גַּב דְּ... אֶלָּא</td><td>although... nevertheless</td></tr>\n                        <tr><td>With subsequent concession</td><td>אַף עַל גַּב דְּ... אֲפִילוּ הָכִי</td><td>even though... even so</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Prefixes",
      "question": "What is the function of the prefix אִת־ (it-) in Aramaic?",
      "options": [
        "Forms reflexive/passive verbs",
        "Indicates direction",
        "Creates comparative adjectives",
        "Marks possession"
      ],
      "correct": 0,
      "explanation": "The Aramaic connective <b>אִי</b> (i) expresses condition ('if'). This conjunction introduces a conditional clause that specifies a circumstance under which the main clause applies.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Conditional Constructions with i</h4>\n                    <table>\n                        <tr><th>Type</th><th>Example</th><th>Meaning/Function</th></tr>\n                        <tr><td>Simple condition</td><td>אִי אָמַר, נִיזִיל</td><td>if he says, we will go</td></tr>\n                        <tr><td>Negative condition</td><td>אִי לָא אָמַר</td><td>if he does not say</td></tr>\n                        <tr><td>Hypothetical</td><td>אִי הֲוָה אָמַר</td><td>if he had said (contrary to fact)</td></tr>\n                        <tr><td>In legal formulation</td><td>אִי אָמְרַתְּ בִּשְׁלָמָא</td><td>if you say, it is well (in argumentation)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Prefixes",
      "question": "What is the function of the prefix בְּ־ (be-) in Aramaic?",
      "options": [
        "Indicates 'in/at/by' (locative/instrumental)",
        "Forms causative verbs",
        "Creates plural nouns",
        "Marks negation"
      ],
      "correct": 0,
      "explanation": "The Aramaic connective <b>מִן דְּ</b> (min de-) expresses time ('since/from the time that'). This conjunction introduces a temporal clause indicating the starting point of the action in the main clause.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Temporal Expressions with min de-</h4>\n                    <table>\n                        <tr><th>Construction</th><th>Example</th><th>Meaning</th></tr>\n                        <tr><td>מִן דְּ + perfect verb</td><td>מִן דַּאֲתָא</td><td>since he came</td></tr>\n                        <tr><td>מִן דְּ + subject + verb</td><td>מִן דְּרַבִּי אֲמַר</td><td>from the time that Rabbi said</td></tr>\n                        <tr><td>With specific time</td><td>מִן יוֹמָא דְּ</td><td>from the day that</td></tr>\n                        <tr><td>With present relevance</td><td>מִן דְּ... וְעַד הַשְׁתָּא</td><td>from when... until now</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Connectives",
      "question": "What is the primary Aramaic conjunction equivalent to 'and'?",
      "options": [
        "וְ (ve-)",
        "אוֹ (o)",
        "אַף (af)",
        "דְּ (de-)"
      ],
      "correct": 0,
      "explanation": "The Aramaic phrase <b>בְּרַם</b> (beram) is used to introduce contrasting information ('but/however'). This conjunction signals that what follows contradicts or limits what was previously stated.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Contrastive Functions of beram</h4>\n                    <table>\n                        <tr><th>Function</th><th>Example Pattern</th><th>Meaning</th></tr>\n                        <tr><td>Simple contrast</td><td>X בְּרַם Y</td><td>X, but Y</td></tr>\n                        <tr><td>Limitation</td><td>אִין/לָא, בְּרַם...</td><td>Yes/No, however...</td></tr>\n                        <tr><td>Exception</td><td>הַכֹּל, בְּרַם...</td><td>Everything, except...</td></tr>\n                        <tr><td>Correction</td><td>סָלְקָא דַעְתָּךְ X, בְּרַם Y</td><td>You might think X, but really Y</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Connectives",
      "question": "Which Aramaic connective expresses purpose (in order that)?",
      "options": [
        "כְּדֵי (kedei)",
        "כַּד (kad)",
        "אֶלָּא (ella)",
        "אִי (i)"
      ],
      "correct": 0,
      "explanation": "The term <b>סוגיא</b> (sugya) means 'a topical discussion unit in the Talmud' - a coherent section that explores a specific subject through questions, answers, challenges, and resolutions.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Structure of a Typical Sugya</h4>\n                    <table>\n                        <tr><th>Component</th><th>Function</th><th>Typical Phrases</th></tr>\n                        <tr><td>Opening text</td><td>Source passage (often Mishnah)</td><td>\"Our Mishnah states...\"</td></tr>\n                        <tr><td>Questions</td><td>Raising difficulties or seeking sources</td><td>\"From where is this derived?\", \"What is the reason?\"</td></tr>\n                        <tr><td>Discussion</td><td>Debate between authorities</td><td>\"X says... but Y says...\"</td></tr>\n                        <tr><td>Resolution</td><td>Conclusion or harmonization</td><td>\"It must be that...\", \"This is not difficult...\"</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Connectives",
      "question": "Which Aramaic connective is equivalent to 'or'?",
      "options": [
        "אוֹ (o)",
        "וְ (ve-)",
        "אֲרוּ (aru)",
        "אַף (af)"
      ],
      "correct": 0,
      "explanation": "The term <b>מחלוקת</b> (machloket) means 'a disagreement between sages' - a formal dispute between rabbis regarding legal rulings, textual interpretations, or theological matters.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Structure of Machloket in Talmudic Discourse</h4>\n                    <table>\n                        <tr><th>Component</th><th>Function</th><th>Example</th></tr>\n                        <tr><td>Statement of positions</td><td>Presenting opposing views</td><td>\"Beit Shammai says X, Beit Hillel says Y\"</td></tr>\n                        <tr><td>Reasoning</td><td>Explaining the basis for each view</td><td>\"The reason for X is...; the reason for Y is...\"</td></tr>\n                        <tr><td>Scriptural support</td><td>Citing texts supporting each position</td><td>\"X interprets this verse to mean...; Y interprets it as...\"</td></tr>\n                        <tr><td>Practical ruling</td><td>Determining which view to follow</td><td>\"The halakhah follows X\"</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Connectives",
      "question": "Which Aramaic connective expresses concession (although/even though)?",
      "options": [
        "אַף עַל גַּב דְּ (af al gav de-)",
        "כֵּיוָן דְּ (keivan de-)",
        "כִּי (ki)",
        "אִלּוּ (illu)"
      ],
      "correct": 0,
      "explanation": "The term <b>שמעתא</b> (shema'ata) refers to 'a reported tradition or teaching' - an authoritative statement or ruling that has been transmitted through the chain of tradition.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Components of Shema'ata</h4>\n                    <table>\n                        <tr><th>Element</th><th>Function</th><th>Example Formula</th></tr>\n                        <tr><td>Attribution</td><td>Naming the source</td><td>\"Rabbi X said in the name of Rabbi Y\"</td></tr>\n                        <tr><td>Content</td><td>The actual teaching</td><td>Legal ruling, scriptural interpretation, etc.</td></tr>\n                        <tr><td>Transmission</td><td>How it was conveyed</td><td>\"It was taught...\", \"We learned...\"</td></tr>\n                        <tr><td>Verification</td><td>Testing authenticity</td><td>\"When this was said before Rabbi Z, he said...\"</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Connectives",
      "question": "Which Aramaic connective expresses condition (if)?",
      "options": [
        "אִי (i)",
        "כַּד (kad)",
        "אֲרוּ (aru)",
        "בָּתַר דְּ (batar de-)"
      ],
      "correct": 0,
      "explanation": "The term <b>הלכתא</b> (hilkhata) refers to 'the final legal ruling' - the authoritative decision on a disputed legal matter, determining practical observance.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Formulating Hilkhata</h4>\n                    <table>\n                        <tr><th>Formula</th><th>Meaning</th><th>Context</th></tr>\n                        <tr><td>הִלְכְתָא כְּ-X</td><td>The law follows X</td><td>After presenting a dispute</td></tr>\n                        <tr><td>וְהִלְכְתָא</td><td>And the law is...</td><td>Introducing final decision</td></tr>\n                        <tr><td>לֵית הִלְכְתָא כְּ-X</td><td>The law does not follow X</td><td>Rejecting a position</td></tr>\n                        <tr><td>הִלְכְתָא כְּוָתֵיהּ בְּחֲדָא</td><td>The law follows him in one matter</td><td>Partial acceptance</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Connectives",
      "question": "Which Aramaic connective expresses time (since/from the time that)?",
      "options": [
        "מִן דְּ (min de-)",
        "עַד דְּ (ad de-)",
        "כַּד (kad)",
        "בְּעוֹד דְּ (be'od de-)"
      ],
      "correct": 0,
      "explanation": "The suffix <b>־ָן</b> (-an) in Aramaic forms adjectives from nouns. It creates descriptive terms signifying 'possessing the quality of' or 'characterized by' the base noun.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Adjective Formation with -an Suffix</h4>\n                    <table>\n                        <tr><th>Base Noun</th><th>Derived Adjective</th><th>Meaning</th><th>Usage Example</th></tr>\n                        <tr><td>חֵימָה (anger)</td><td>חֵימָן (angry)</td><td>Characterized by anger</td><td>גַּבְרָא חֵימָן (angry man)</td></tr>\n                        <tr><td>בַּטְלָה (idleness)</td><td>בַּטְלָן (idle)</td><td>Prone to idleness</td><td>תַּלְמִידָא בַּטְלָן (idle student)</td></tr>\n                        <tr><td>שֵׁינָה (sleep)</td><td>שֵׁינָן (sleepy)</td><td>Predisposed to sleep</td><td>אִינִישׁ שֵׁינָן (sleepy person)</td></tr>\n                        <tr><td>גַּוְּהָה (pride)</td><td>גַּיְוָן (proud)</td><td>Full of pride</td><td>מַלְכָּא גַּיְוָן (proud king)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Aramaic Connectives",
      "question": "Which Aramaic phrase is used to introduce contrasting information (but/however)?",
      "options": [
        "אֶלָּא (ella)",
        "בְּרַם (beram)",
        "לָכֵן (lakhen)",
        "אַדְרַבָּה (adrabba)"
      ],
      "correct": 1,
      "explanation": "The suffix <b>־וּ</b> (-u) in Aramaic verbs marks third-person masculine plural in perfect (past tense) forms. It indicates that multiple male subjects performed the action.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Third-Person Masculine Plural Perfect Forms</h4>\n                    <table>\n                        <tr><th>Singular (he)</th><th>Plural with -u (they)</th><th>Root</th><th>Example in Context</th></tr>\n                        <tr><td>אֲזַל (azal)</td><td>אֲזַלוּ (azalu)</td><td>א.ז.ל (go)</td><td>רַבָּנַן אֲזַלוּ (the rabbis went)</td></tr>\n                        <tr><td>יְתֵיב (yetiv)</td><td>יְתִיבוּ (yetivu)</td><td>י.ת.ב (sit)</td><td>תַּלְמִידֵי יְתִיבוּ (the students sat)</td></tr>\n                        <tr><td>עֲבַד (avad)</td><td>עֲבַדוּ (avadu)</td><td>ע.ב.ד (do)</td><td>אִינְהוּ עֲבַדוּ (they did)</td></tr>\n                        <tr><td>שְׁמַע (shema)</td><td>שְׁמַעוּ (shema'u)</td><td>ש.מ.ע (hear)</td><td>כֻּלְּהוּ שְׁמַעוּ (all of them heard)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Terminology",
      "question": "What does the term 'סוגיא' (sugya) mean in Talmudic study?",
      "options": [
        "A topical discussion unit in the Talmud",
        "A legal ruling",
        "A commentary on the Torah",
        "A prayer recitation"
      ],
      "correct": 0,
      "explanation": "The suffix <b>־וּת</b> (-ut) in Aramaic forms abstract nouns. This suffix transforms concrete terms into concepts, conditions, or states of being.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Abstract Noun Formation with -ut</h4>\n                    <table>\n                        <tr><th>Base Term</th><th>Abstract Noun</th><th>Meaning</th><th>Usage in Talmud</th></tr>\n                        <tr><td>חַכִּים (wise)</td><td>חַכִּימוּת (wisdom)</td><td>State of being wise</td><td>Discussions of knowledge</td></tr>\n                        <tr><td>שָׁטֶה (foolish)</td><td>שְׁטוּת (foolishness)</td><td>Quality of being foolish</td><td>Discussions of errant behavior</td></tr>\n                        <tr><td>שֻׁתָּף (partner)</td><td>שֻׁתָּפוּת (partnership)</td><td>State of being partners</td><td>Business law discussions</td></tr>\n                        <tr><td>עָנִי (poor)</td><td>עֲנִיּוּת (poverty)</td><td>Condition of being poor</td><td>Charity discussions</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Terminology",
      "question": "What does the term 'מחלוקת' (machloket) mean in Talmudic study?",
      "options": [
        "A disagreement between sages",
        "A prayer formula",
        "A specific type of legal ruling",
        "A commentary structure"
      ],
      "correct": 0,
      "explanation": "The prefix <b>מְ־</b> (me-) in Aramaic forms verbal participles. This prefix creates forms that function both as present-tense verbs and as agent nouns (describing the doer of an action).",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Functions of me- Participles</h4>\n                    <table>\n                        <tr><th>Type</th><th>Example</th><th>Function</th><th>Translation</th></tr>\n                        <tr><td>Present tense</td><td>מְדַבֵּר (medaber)</td><td>Ongoing action</td><td>speaks/is speaking</td></tr>\n                        <tr><td>Agent noun</td><td>מְדַבֵּר (medaber)</td><td>Person who does action</td><td>speaker</td></tr>\n                        <tr><td>Gnomic present</td><td>מְהַדַּר (mehadar)</td><td>Habitual action</td><td>regularly returns</td></tr>\n                        <tr><td>Imminent future</td><td>מְקַבֵּל (meqabel)</td><td>About to happen</td><td>about to receive</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Terminology",
      "question": "What does the term 'שמעתא' (shema'ata) refer to in Talmudic literature?",
      "options": [
        "A reported tradition or teaching",
        "A legal ruling",
        "A prayer formula",
        "A section of Biblical text"
      ],
      "correct": 0,
      "explanation": "The prefix <b>אַ־</b> (a-) in Aramaic forms causative verbs in the Af'el binyan. It creates forms indicating that a subject causes someone or something else to perform the basic verb's action.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Causative Relationships in Af'el</h4>\n                    <table>\n                        <tr><th>Base Action (Pe'al)</th><th>Causative (Af'el)</th><th>Meaning Transformation</th><th>Example</th></tr>\n                        <tr><td>מְיֵית (dies)</td><td>אַמֵּית (kills)</td><td>die → cause to die</td><td>לָא תַאמֵּית (do not kill)</td></tr>\n                        <tr><td>יָתֵיב (sits)</td><td>אוֹתֵיב (seats)</td><td>sit → cause to sit</td><td>אוֹתְבֵיהּ (he seated him)</td></tr>\n                        <tr><td>יָלֵיף (learns)</td><td>אַלֵּיף (teaches)</td><td>learn → cause to learn</td><td>מַאן אַלְּפָךְ (who taught you?)</td></tr>\n                        <tr><td>שָׁתֵי (drinks)</td><td>אַשְׁקֵי (gives drink)</td><td>drink → cause to drink</td><td>אַשְׁקְיוּהּ (they gave him to drink)</td></tr>\n                    </table>\n                </div>"
    },
    {
      "category": "Talmudic Terminology",
      "question": "What does the term 'הלכתא' (hilkhata) refer to in the Talmud?",
      "options": [
        "The final legal ruling",
        "A prayer formula",
        "A type of commentary",
        "A section of Biblical text"
      ],
      "correct": 0,
      "explanation": "The prefix <b>אִת־</b> (it-) in Aramaic forms reflexive/passive verbs. This prefix transforms active verbs into forms where the action rebounds on the subject or where the subject receives the action rather than performing it.",
      "diagram": "<div class=\"aramaic-diagram\">\n                    <h4>Passive/Reflexive Transformations</h4>\n                    <table>\n                        <tr><th>Active</th><th>Passive/Reflexive</th><th>Type</th><th>Example Usage</th></tr>\n                        <tr><td>קְטַל (killed)</td><td>אִתְקְטִיל (was killed)</td><td>Passive</td><td>גַּבְרָא אִתְקְטִיל (the man was killed)</td></tr>\n                        <tr><td>קַדֵּשׁ (sanctified)</td><td>אִתְקַדַּשׁ (sanctified himself)</td><td>Reflexive</td><td>כֹּהֵן אִתְקַדַּשׁ (the priest sanctified himself)</td></tr>\n                        <tr><td>אָמַר (said)</td><td>אִתְאֲמַר (was said)</td><td>Passive</td><td>הָכִי אִתְאֲמַר (thus it was said)</td></tr>\n                        <tr><td>חֲזָא (saw)</td><td>אִתְחֲזֵי (appeared)</td><td>Middle voice</td><td>חֶלְמָא אִתְחֲזֵי לֵיהּ (a dream appeared to him)</td></tr>\n                    </table>\n                </div>"
    }
  ];

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    
    if (index === quizData[currentQuestion].correct) {
      
      setCorrectAnswers(correctAnswers + 1);
    } else {}
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      if (currentQuestion < quizData.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowExplanation(false);
      } else {
        setQuizCompleted(true);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setSelectedOption(null);
    setCorrectAnswers(0);
    setShowExplanation(false);
  };

  // Group questions by category for the results breakdown
  const scoreBreakdown = () => {
    const categories = {};
    let questionsByCategory = {};
    let correctByCategory = {};
    
    quizData.forEach((q, index) => {
      if (!questionsByCategory[q.category]) {
        questionsByCategory[q.category] = 0;
        correctByCategory[q.category] = 0;
      }
      questionsByCategory[q.category]++;
    });
    
    // For actual implementation, you'd need to track answers by category
    
    return Object.keys(questionsByCategory).map(category => {
      return {
        category,
        total: questionsByCategory[category],
        correct: correctByCategory[category] || 0
      };
    });
  };

  return (
    <div className="quiz-app-container">
      <section className="hero">
        <div className="container">
          <h1>Master Talmudic Aramaic</h1>
          <a href="#quiz" className="btn">Start Quiz</a>
        </div>
      </section>

      <section id="quiz" className="quiz-section">
        <div className="container">
          <h2>Aramaic Mastery Quiz</h2>
          {!quizCompleted ? (
            <div className="quiz-container">
              <div className="quiz-progress">
                <span id="current-question">{currentQuestion + 1}</span>/<span id="total-questions">{quizData.length}</span>
              </div>
              <div className="question-container">
                <div className="quiz-question">{quizData[currentQuestion].question}</div>
                <button 
                  className="translate-btn" 
                  onClick={() => setShowExplanation(!showExplanation)}
                >
                  {showExplanation ? "Hide Explanation" : "Show Explanation"}
                </button>
                {showExplanation && (
                  <div className="quiz-translation" dangerouslySetInnerHTML={{ __html: quizData[currentQuestion].explanation + (quizData[currentQuestion].diagram || '') }} />
                )}
              </div>
              <div className="quiz-options">
                {quizData[currentQuestion].options.map((option, index) => (
                  <div 
                    key={index}
                    className={`option ${selectedOption === index ? (index === quizData[currentQuestion].correct ? 'correct' : 'wrong') : ''}`}
                    data-index={index}
                    onClick={() => handleOptionClick(index)}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <div className="quiz-controls">
                <button 
                  className="btn" 
                  id="prev-btn" 
                  disabled={currentQuestion === 0}
                  onClick={handlePrevQuestion}
                >
                  Previous
                </button>
                <button 
                  className="btn" 
                  id="next-btn"
                  onClick={handleNextQuestion}
                  disabled={selectedOption === null}
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="result-container">
              <h3>Quiz Complete!</h3>
              <p className="result-info">
                You answered <span id="correct-count">{correctAnswers}</span> out of <span id="total-count">{quizData.length}</span> questions correctly.
              </p>
              <div className="score-breakdown">
                <h4>Your Score Breakdown</h4>
                <div id="score-categories">
                  {scoreBreakdown().map((category, index) => (
                    <div key={index} className="category-score">
                      <span className="category-name">{category.category}: </span>
                      <span className="category-result">{category.correct}/{category.total}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="key-takeaway">
                <p><strong>Key Takeaway:</strong> <span id="key-takeaway-text">
                  {correctAnswers > (quizData.length * 0.7) 
                    ? "Excellent work! You have a strong grasp of Aramaic grammar." 
                    : correctAnswers > (quizData.length * 0.5)
                      ? "Good job! Keep practicing to master the concepts you missed."
                      : "Keep practicing your Aramaic grammar skills regularly to improve!"}
                </span></p>
              </div>
              <button className="btn" id="restart-btn" onClick={restartQuiz}>
                Restart Quiz
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AramicQuiz;