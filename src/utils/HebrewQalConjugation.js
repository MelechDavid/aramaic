/**
 * Hebrew Qal (Pa'al) Conjugation with Full Exception Handling
 *
 * Ported from Ruby VerbConstructor::Paal
 * Handles: strong verbs, hollow verbs (ayin-vav/ayin-yud), pe-yud, pe-nun,
 * pe-guttural, lamed-hey, lamed-aleph, guttural R2/R3, and hardcoded exceptions.
 */

// === Hebrew letter constants ===
const ALEPH  = '\u05D0';
const BET    = '\u05D1';
const GIMEL  = '\u05D2';
const DALET  = '\u05D3';
const HEY    = '\u05D4';
const VAV    = '\u05D5';
const ZAYIN  = '\u05D6';
const CHET   = '\u05D7';
const TET    = '\u05D8';
const YUD    = '\u05D9';
const KAF    = '\u05DB';
const LAMED  = '\u05DC';
const MEM    = '\u05DE';
const NUN    = '\u05E0';
const SAMEKH = '\u05E1';
const AYIN   = '\u05E2';
const PE     = '\u05E4';
const TSADI  = '\u05E6';
const QOF    = '\u05E7';
const RESH   = '\u05E8';
const SHIN   = '\u05E9';
const TAV    = '\u05EA';

// Sofit (final forms)
const MEM_S  = '\u05DD';
const NUN_S  = '\u05DF';

// === Vowel marks ===
const SHVA    = '\u05B0'; // ְ
const HATAF_S = '\u05B1'; // ֱ hataf segol
const HATAF_P = '\u05B2'; // ֲ hataf patach
const HATAF_Q = '\u05B3'; // ֳ hataf qamats
const HIRIQ   = '\u05B4'; // ִ
const TSERE   = '\u05B5'; // ֵ
const SEGOL   = '\u05B6'; // ֶ
const PATACH  = '\u05B7'; // ַ
const QAMATS  = '\u05B8'; // ָ
const HOLAM   = '\u05B9'; // ֹ
const DAGESH  = '\u05BC'; // ּ
const SHIN_D  = '\u05C1'; // shin dot
const SIN_D   = '\u05C2'; // sin dot

// === Sets ===
const GUTTURAL = new Set([ALEPH, HEY, CHET, AYIN]);
const STRESS   = new Set([BET, KAF, PE]); // begadkefat letters that get dagesh

const rk = (r) => r.join('.');
const ins = (s, i, c) => s.slice(0, i) + c + s.slice(i);

// Exception root sets
const PEI_XET_PRES = new Set([
  rk([CHET, DALET, LAMED]), rk([CHET, SAMEKH, RESH]),
  rk([CHET, RESH, DALET]), rk([CHET, PE, TSADI]),
]);
const PEI_XET_PRES_FUT = new Set([
  rk([CHET, DALET, LAMED]), rk([CHET, SAMEKH, RESH]), rk([CHET, RESH, DALET]),
]);
const COND_VERBS = new Set([
  rk([RESH, AYIN, BET]), rk([KAF, MEM, HEY]), rk([SHIN, MEM, CHET]),
  rk([YUD, GIMEL, AYIN]), rk([YUD, RESH, ALEPH]), rk([TSADI, MEM, ALEPH]),
]);
const EXC_ROOTS = new Set([
  rk([TAV, MEM, MEM]), rk([YUD, KAF, LAMED]), rk([NUN, GIMEL, SHIN]),
  rk([NUN, TAV, NUN]), rk([HEY, YUD, HEY]), rk([CHET, YUD, HEY]), rk([MEM, VAV, TAV]),
]);
const EXC_FUT_ROOTS = new Set([
  rk([LAMED, MEM, DALET]), rk([LAMED, BET, SHIN]), rk([SHIN, KAF, BET]),
  rk([QOF, RESH, NUN]), rk([GIMEL, DALET, LAMED]), rk([DALET, BET, QOF]),
]);
const NUN_NORMAL = new Set([rk([NUN, QOF, MEM]), rk([NUN, SHIN, MEM])]);
const HEI_EXC = new Set([rk([KAF, MEM, HEY]), rk([GIMEL, BET, HEY])]);

// Key shortcuts
const K_GBH = rk([GIMEL, BET, HEY]);
const K_TMM = rk([TAV, MEM, MEM]);
const K_YKL = rk([YUD, KAF, LAMED]);
const K_NGS = rk([NUN, GIMEL, SHIN]);
const K_NTN = rk([NUN, TAV, NUN]);
const K_HYH = rk([HEY, YUD, HEY]);
const K_CHH = rk([CHET, YUD, HEY]);
const K_MVT = rk([MEM, VAV, TAV]);
const K_YSN = rk([YUD, SHIN, NUN]);
const K_YRA = rk([YUD, RESH, ALEPH]);
const K_GDL = rk([GIMEL, DALET, LAMED]);
const K_DBQ = rk([DALET, BET, QOF]);
const K_KBH = rk([KAF, BET, HEY]);
const K_HLK = rk([HEY, LAMED, KAF]);
const K_YRD = rk([YUD, RESH, DALET]);
const K_YDA = rk([YUD, DALET, AYIN]);
const K_YLD = rk([YUD, LAMED, DALET]);
const K_YSB = rk([YUD, SHIN, BET]);
const K_YRS = rk([YUD, RESH, SHIN]);
const K_YGA = rk([YUD, GIMEL, AYIN]);
const K_CMA = rk([TSADI, MEM, ALEPH]);
const K_AMR = rk([ALEPH, MEM, RESH]);
const K_CNN = rk([CHET, NUN, NUN]);
const K_NGA = rk([NUN, GIMEL, AYIN]);
const K_NPL = rk([NUN, PE, LAMED]);
const K_LQC = rk([LAMED, QOF, CHET]);
const K_SKB = rk([SHIN, KAF, BET]);
const K_BVA = rk([BET, VAV, ALEPH]);
const K_AHB = rk([ALEPH, HEY, BET]);
const K_AKL = rk([ALEPH, KAF, LAMED]);
const K_ABD = rk([ALEPH, BET, DALET]);
const K_AAMR = rk([ALEPH, MEM, RESH]);
const K_ACZ = rk([ALEPH, CHET, ZAYIN]);
const K_AHD = rk([ALEPH, HEY, DALET]);
const K_YTR = rk([YUD, TSADI, RESH]);
const K_YZM = rk([YUD, ZAYIN, MEM]);
const K_NPL2 = rk([NUN, PE, LAMED]);
const K_NTS = rk([NUN, TET, SHIN]);
const K_NTR = rk([NUN, TET, RESH]);
const K_KMH = rk([KAF, MEM, HEY]);
const K_YRH = rk([YUD, RESH, HEY]);
const K_NTH = rk([NUN, TET, HEY]);
const K_APH = rk([ALEPH, PE, HEY]);

// ================================================================
// PARTICIPLE (present_tense) — also produces pastBase
// ================================================================
function computeParticiple(root) {
  const [R1, R2, R3] = root;
  const key = rk(root);

  // Base Qal active participle (holam male with vav)
  let ms  = R1 + VAV + HOLAM + R2 + TSERE + R3;
  let fs  = R1 + VAV + HOLAM + R2 + SEGOL + R3 + SEGOL + TAV;
  let mp  = R1 + VAV + HOLAM + R2 + SHVA + R3 + HIRIQ + YUD + MEM_S;
  let fp  = R1 + VAV + HOLAM + R2 + SHVA + R3 + VAV + HOLAM + TAV;
  let pastBase = R1 + QAMATS + R2 + PATACH + R3;

  // 1. Pe-chet exceptions
  if (PEI_XET_PRES.has(key)) {
    ms = R1 + QAMATS + R2 + TSERE + R3;
    fs = R1 + HATAF_P + R2 + TSERE + R3 + QAMATS + HEY;
    mp = R1 + HATAF_P + R2 + TSERE + R3 + HIRIQ + YUD + MEM_S;
    fp = R1 + HATAF_P + R2 + TSERE + R3 + VAV + HOLAM + TAV;
  }

  // 2. Hollow verbs (R2=ו/י, R3≠ה)
  if ([VAV, YUD].includes(R2) && R3 !== HEY) {
    ms = R1 + QAMATS + R3;
    fs = R1 + QAMATS + R3 + QAMATS + HEY;
    mp = R1 + QAMATS + R3 + HIRIQ + YUD + MEM_S;
    fp = R1 + QAMATS + R3 + VAV + HOLAM + TAV;
    pastBase = R1 + QAMATS + R3;
    if ([CHET, AYIN].includes(R3)) {
      ms += PATACH;
    }
  }

  // 3. Guttural R3 (ח/ע), non-hollow
  if ([CHET, AYIN].includes(R3) && ![VAV, CHET, YUD].includes(R2)) {
    ms += PATACH;
    fs = R1 + VAV + HOLAM + R2 + PATACH + R3 + PATACH + TAV;
  }

  // 4. R3=א (not hollow with vav)
  if (R3 === ALEPH && !(R1 === BET && R2 === VAV)) {
    fs = R1 + VAV + HOLAM + R2 + TSERE + R3 + TAV;
    pastBase = R1 + QAMATS + R2 + QAMATS + R3;
  }

  // 5. R3=ה (lamed-hey), not HEI_EXCEPTION
  if (R3 === HEY && !HEI_EXC.has(key)) {
    ms = R1 + VAV + HOLAM + R2 + SEGOL + HEY;
    fs = R1 + VAV + HOLAM + R2 + QAMATS + HEY;
    mp = R1 + VAV + HOLAM + R2 + HIRIQ + YUD + MEM_S;
    fp = R2 === VAV
      ? R1 + HOLAM + VAV + HOLAM + VAV + TAV
      : R1 + VAV + HOLAM + R2 + VAV + HOLAM + TAV;
    if (key === K_KBH) {
      ms = KAF + BET + SEGOL + HEY;
      fs = KAF + BET + QAMATS + HEY;
      mp = KAF + BET + HIRIQ + YUD + MEM_S;
      fp = KAF + BET + VAV + HOLAM + TAV;
    }
    pastBase = R1 + QAMATS + R2 + QAMATS + HEY;
  }

  // 6. ישנ exception
  if (key === K_YSN) {
    ms = YUD + QAMATS + SHIN + SHIN_D + TSERE + NUN;
    fs = YUD + SHVA + SHIN + SHIN_D + TSERE + NUN + HEY;
    mp = YUD + SHVA + SHIN + SHIN_D + TSERE + NUN + HIRIQ + YUD + MEM_S;
    fp = YUD + SHVA + SHIN + SHIN_D + TSERE + NUN + VAV + HOLAM + TAV;
  }

  // 7. Condition verbs
  if (COND_VERBS.has(key)) {
    const sound = (R1 === YUD || key === K_CMA) ? QAMATS : PATACH;
    ms = R1 + sound + R2 + TSERE + R3;
    if (R3 === CHET) ms += PATACH;
    fs = R1 + SHVA + R2 + TSERE + R3 + QAMATS + HEY;
    mp = R1 + SHVA + R2 + TSERE + R3 + HIRIQ + YUD + MEM_S;
    fp = R1 + SHVA + R2 + TSERE + R3 + VAV + HOLAM + TAV;
    if (key === K_YRA) {
      pastBase = YUD + QAMATS + RESH + TSERE + ALEPH;
    }
  }

  // 8. גדל / דבק
  if (key === K_GDL || key === K_DBQ) {
    ms = R1 + QAMATS + R2 + TSERE + R3;
    fs = R1 + SHVA + R2 + TSERE + R3 + QAMATS + HEY;
    mp = R1 + SHVA + R2 + TSERE + R3 + HIRIQ + YUD + MEM_S;
    fp = R1 + SHVA + R2 + TSERE + R3 + VAV + HOLAM + TAV;
  }

  // 9. Exception roots — fully hardcoded
  if (EXC_ROOTS.has(key)) {
    const e = presentException(key);
    if (e) { ms = e.ms; fs = e.fs; mp = e.mp; fp = e.fp; pastBase = e.pastBase; }
  }

  // 10. Guttural R2 (not guttural R3, not condition verb, not exception)
  if (GUTTURAL.has(R2) && !GUTTURAL.has(R3) && !COND_VERBS.has(key) && !EXC_ROOTS.has(key)) {
    mp = R1 + VAV + HOLAM + R2 + HATAF_P + R3 + HIRIQ + YUD + MEM_S;
    fp = R1 + VAV + HOLAM + R2 + HATAF_P + R3 + VAV + HOLAM + TAV;
  }

  // 11. Dagesh on begadkefat R1
  if (STRESS.has(R1)) {
    ms = ins(ms, 1, DAGESH);
    fs = ins(fs, 1, DAGESH);
    mp = ins(mp, 1, DAGESH);
    fp = ins(fp, 1, DAGESH);
  }

  return { ms, fs, mp, fp, pastBase };
}

// Hardcoded present tense for exception roots
function presentException(key) {
  switch (key) {
    case K_GBH: return {
      ms: GIMEL + QAMATS + BET + VAV + HOLAM + HEY + PATACH,
      fs: GIMEL + SHVA + BET + VAV + HOLAM + HEY + QAMATS + HEY,
      mp: GIMEL + SHVA + BET + VAV + HOLAM + HEY + HIRIQ + YUD + MEM_S,
      fp: GIMEL + SHVA + BET + VAV + HOLAM + HEY + HOLAM + TAV,
      pastBase: GIMEL + QAMATS + BET + PATACH + HEY,
    };
    case K_TMM: return {
      ms: TAV + PATACH + MEM,
      fs: TAV + PATACH + MEM + QAMATS + HEY,
      mp: TAV + PATACH + MEM + HIRIQ + YUD + MEM,
      fp: TAV + PATACH + MEM + VAV + HOLAM + TAV,
      pastBase: TAV + PATACH + MEM,
    };
    case K_YKL: return {
      ms: YUD + QAMATS + KAF + VAV + HOLAM + LAMED,
      fs: YUD + QAMATS + KAF + VAV + HOLAM + LAMED + QAMATS + HEY,
      mp: YUD + QAMATS + KAF + VAV + HOLAM + LAMED + HIRIQ + YUD + MEM_S,
      fp: YUD + QAMATS + KAF + VAV + HOLAM + LAMED + VAV + HOLAM + TAV,
      pastBase: YUD + QAMATS + KAF + VAV + HOLAM + LAMED,
    };
    case K_NGS: return {
      ms: NUN + HIRIQ + YUD + GIMEL + QAMATS + SHIN + SHIN_D,
      fs: NUN + HIRIQ + YUD + GIMEL + SEGOL + SHIN + SHIN_D + SEGOL + TAV,
      mp: NUN + HIRIQ + YUD + GIMEL + QAMATS + SHIN + SHIN_D + HIRIQ + YUD + MEM_S,
      fp: NUN + HIRIQ + YUD + GIMEL + QAMATS + SHIN + SHIN_D + VAV + HOLAM + TAV,
      pastBase: NUN + HIRIQ + YUD + GIMEL + PATACH + SHIN + SHIN_D,
    };
    case K_NTN: return {
      ms: NUN + VAV + HOLAM + TAV + TSERE + NUN,
      fs: NUN + VAV + HOLAM + TAV + SEGOL + NUN + SEGOL + TAV,
      mp: NUN + VAV + HOLAM + TAV + SHVA + NUN + HIRIQ + YUD + MEM_S,
      fp: NUN + VAV + HOLAM + TAV + SHVA + NUN + VAV + HOLAM + TAV,
      pastBase: NUN + QAMATS + TAV + PATACH + NUN,
    };
    case K_HYH: return {
      ms: null, fs: null, mp: null, fp: null,
      pastBase: HEY + QAMATS + YUD + QAMATS + HEY,
    };
    case K_CHH: return {
      ms: CHET + PATACH + YUD,
      fs: CHET + PATACH + YUD + QAMATS + HEY,
      mp: CHET + PATACH + YUD + HIRIQ + YUD + MEM_S,
      fp: CHET + PATACH + YUD + VAV + TAV,
      pastBase: CHET + QAMATS + YUD + QAMATS + HEY,
    };
    case K_MVT: return {
      ms: MEM + TSERE + TAV,
      fs: MEM + TSERE + TAV + QAMATS + HEY,
      mp: MEM + TSERE + TAV + HIRIQ + YUD + MEM_S,
      fp: MEM + TSERE + TAV + VAV + HOLAM + TAV,
      pastBase: MEM + TSERE + TAV,
    };
    default: return null;
  }
}

// ================================================================
// INFINITIVE
// ================================================================
function computeInfinitive(root) {
  const [R1, R2, R3] = root;
  const key = rk(root);

  // Base: לִ+R1+ְ+R2+וֹ+R3
  let inf = LAMED + HIRIQ + R1 + SHVA + R2 + VAV + HOLAM + R3;

  // Guttural R1
  if (GUTTURAL.has(R1)) {
    if (R1 === ALEPH) {
      if (R2 === MEM && R3 === RESH) {
        // אמר → לומר
        inf = LAMED + VAV + HOLAM + MEM + PATACH + RESH;
      } else {
        inf = LAMED + SEGOL + R1 + HATAF_S + R2 + VAV + HOLAM + R3;
      }
    } else {
      if (key === K_CNN) {
        inf = LAMED + QAMATS + CHET + VAV + HOLAM + NUN;
      } else {
        inf = LAMED + PATACH + R1 + HATAF_P + R2 + VAV + HOLAM + R3;
      }
    }
  }

  // Pe-yud or הלך
  if (R1 === YUD || key === K_HLK) {
    const peYudSpecial = new Set([K_HLK, K_YRD, K_YDA, K_YLD, K_YSB, K_YRS]);
    if (peYudSpecial.has(key)) {
      // לָ+R2+ֶ+R3+ֶ+ת pattern
      inf = LAMED + QAMATS + R2 + SEGOL + R3 + SEGOL + TAV;
    } else {
      inf = LAMED + HIRIQ + R1 + R2 + VAV + HOLAM + R3;
    }
    if (R3 === ALEPH) {
      inf = (R2 === RESH)
        ? LAMED + HIRIQ + YUD + RESH + VAV + HOLAM + ALEPH
        : LAMED + QAMATS + R2 + TSERE + ALEPH + TAV;
    }
    if (R3 === AYIN) {
      inf = LAMED + QAMATS + R2 + PATACH + AYIN + PATACH + TAV;
    }
    if (key === K_YGA) {
      inf = null; // no infinitive
    }
  }

  // Pe-nun
  if (R1 === NUN) {
    if (R3 === AYIN && key === K_NGA) {
      inf = LAMED + QAMATS + R2 + PATACH + AYIN + HATAF_P + TAV;
    } else if (R3 === ALEPH) {
      inf = LAMED + QAMATS + R2 + TSERE + ALEPH + TAV;
    } else if (key === K_NPL) {
      inf = LAMED + HIRIQ + PE + VAV + HOLAM + LAMED;
    }
  }

  // R3=ה → replace last char with ת
  if (R3 === HEY && inf) {
    inf = inf.slice(0, -1) + TAV;
  }

  // Hollow verbs (R2=ו/י, R3≠ה)
  if ([VAV, YUD].includes(R2) && R3 !== HEY) {
    let secondComp;
    if (R2 === VAV) secondComp = VAV + DAGESH;
    else secondComp = HIRIQ + YUD;
    if (key === K_BVA) secondComp = VAV + HOLAM;
    inf = LAMED + QAMATS + R1 + secondComp + R3;
  }

  // Special: לקח
  if (key === K_LQC) {
    inf = LAMED + QAMATS + QOF + PATACH + CHET + PATACH + TAV;
  }
  // Special: שכב
  if (key === K_SKB) {
    inf = LAMED + HIRIQ + SHIN + SHVA + KAF + DAGESH + PATACH + BET;
  }

  // Exception root infinitives
  if (EXC_ROOTS.has(key)) {
    switch (key) {
      case K_TMM: inf = LAMED + QAMATS + TAV + HOLAM + MEM; break;
      case K_YKL: inf = null; break;
      case K_NGS: inf = LAMED + QAMATS + GIMEL + SEGOL + SHIN + SEGOL + TAV; break;
      case K_NTN: inf = LAMED + QAMATS + TAV + TSERE + TAV; break;
      case K_HYH: inf = LAMED + HIRIQ + HEY + SHVA + YUD + VAV + HOLAM + TAV; break;
      case K_CHH: inf = LAMED + HIRIQ + CHET + SHVA + YUD + VAV + HOLAM + TAV; break;
    }
  }

  // Guttural R3 furtive patach (if not pe-yud)
  if ([CHET, AYIN].includes(R3) && R1 !== YUD && inf) {
    inf += PATACH;
  }

  // Dagesh on R2 if begadkefat (not pe-aleph/hey/yud/ayin R1)
  if (STRESS.has(R2) && ![ALEPH, HEY, YUD, AYIN].includes(R1) && inf) {
    inf = ins(inf, 5, DAGESH);
  }

  return inf;
}

// ================================================================
// PAST TENSE
// ================================================================
function computePast(root, pastBase) {
  const [R1, R2, R3] = root;
  const key = rk(root);

  let pb = pastBase;

  // Lamed-hey: modify pastBase
  if (R3 === HEY && !HEI_EXC.has(key)) {
    pb = pb.slice(0, -2) + HIRIQ + YUD;
  }

  // Add shva for most consonantal endings (not lamed-hey, not lamed-aleph)
  if ((R3 !== HEY && R3 !== ALEPH) || HEI_EXC.has(key)) {
    pb += SHVA;
  }
  // R3=ת: strip the R3 vowel pair for suffix attachment
  if (R3 === TAV) {
    pb = pb.slice(0, -2);
  }

  let me_past     = pb + TAV + HIRIQ + YUD;
  let youMs_past  = pb + TAV + QAMATS;
  let youFs_past  = pb + TAV + SHVA;
  let we_past     = R3 === NUN ? pb + VAV + DAGESH : pb + NUN + VAV + DAGESH;
  let youMp_past  = pb + TAV + SEGOL + MEM_S;
  let youFp_past  = pb + TAV + SEGOL + NUN_S;

  // 3ms
  let he_past;
  if (R3 === HEY && !HEI_EXC.has(key)) {
    he_past = pastBase;
  } else if ([TAV, AYIN].includes(R3)) {
    he_past = pastBase;
    if (R3 === TAV) pb = pastBase;
  } else {
    he_past = pb;
  }

  // Strip specific positions for 3fs/3cp base (Ruby: slice! 3, then slice! 4)
  let fsBase = pb;
  // In Ruby: _past_base.slice! 3 removes char at index 3
  // _past_base.slice! 4 removes char at (new) index 4
  // This removes the vowel after R2 and the vowel after R2's vowel
  if (pb.length > 4) {
    fsBase = pb.slice(0, 3) + pb.slice(4);
    if (fsBase.length > 4) {
      fsBase = fsBase.slice(0, 4) + fsBase.slice(5);
    }
  }

  // Guttural R3 adjustments for 3fs/3cp base
  if (GUTTURAL.has(R3)) {
    if (R3 === HEY && !HEI_EXC.has(key)) {
      fsBase = fsBase.slice(0, -1);
    }
  }

  // Re-insert shva if R2≠vav
  if (R2 !== VAV) {
    if (fsBase.length >= 3) {
      fsBase = fsBase.slice(0, 3) + SHVA + fsBase.slice(3);
    }
  }

  let she_past, they_past;
  if (R3 === HEY && !HEI_EXC.has(key)) {
    she_past  = fsBase + SHVA + TAV + QAMATS + HEY;
    they_past = fsBase + VAV + DAGESH;
  } else {
    she_past  = fsBase + QAMATS + HEY;
    they_past = fsBase + VAV + DAGESH;
  }

  // Dagesh on begadkefat R1
  if (STRESS.has(R1)) {
    me_past    = ins(me_past, 1, DAGESH);
    youMs_past = ins(youMs_past, 1, DAGESH);
    youFs_past = ins(youFs_past, 1, DAGESH);
    we_past    = ins(we_past, 1, DAGESH);
    youMp_past = ins(youMp_past, 1, DAGESH);
    youFp_past = ins(youFp_past, 1, DAGESH);
    he_past    = ins(he_past, 1, DAGESH);
    she_past   = ins(she_past, 1, DAGESH);
    they_past  = ins(they_past, 1, DAGESH);
  }

  // Exception roots — fully hardcoded
  if (EXC_ROOTS.has(key)) {
    const e = pastException(key);
    if (e) return e;
  }

  return {
    '1cs': me_past, '2ms': youMs_past, '2fs': youFs_past,
    '3ms': he_past, '3fs': she_past, '3cp': they_past,
    '1cp': we_past, '2mp': youMp_past, '2fp': youFp_past,
  };
}

function pastException(key) {
  switch (key) {
    case K_TMM: return {
      '1cs': TAV + PATACH + MEM + VAV + HOLAM + TAV + HIRIQ + YUD,
      '2ms': TAV + PATACH + MEM + VAV + HOLAM + TAV + QAMATS,
      '2fs': TAV + PATACH + MEM + VAV + SIN_D + TAV + SHVA,
      '3ms': TAV + PATACH + MEM,
      '3fs': TAV + PATACH + MEM + QAMATS + HEY,
      '3cp': TAV + PATACH + MEM + VAV + HOLAM,
      '1cp': TAV + PATACH + MEM + VAV + HOLAM + NUN + VAV + DAGESH,
      '2mp': TAV + PATACH + MEM + VAV + HOLAM + TAV + SEGOL + MEM,
      '2fp': TAV + PATACH + MEM + VAV + HOLAM + TAV + SEGOL + NUN_S,
    };
    case K_YKL: return {
      '1cs': YUD + QAMATS + KAF + HOLAM + LAMED + TAV + HIRIQ + YUD,
      '2ms': YUD + QAMATS + KAF + HOLAM + LAMED + TAV + QAMATS,
      '2fs': YUD + QAMATS + KAF + HOLAM + LAMED + TAV + SHVA,
      '3ms': HEY + YUD + HIRIQ + YUD + HEY + ' ' + YUD + QAMATS + KAF + HOLAM + LAMED,
      '3fs': YUD + QAMATS + KAF + SHVA + LAMED + QAMATS + HEY,
      '3cp': YUD + QAMATS + KAF + HOLAM + SHVA + LAMED + VAV + HOLAM,
      '1cp': YUD + QAMATS + KAF + HOLAM + LAMED + NUN + VAV + DAGESH,
      '2mp': YUD + QAMATS + KAF + HOLAM + LAMED + TAV + SEGOL + MEM_S,
      '2fp': YUD + QAMATS + KAF + HOLAM + LAMED + TAV + SEGOL + NUN_S,
    };
    case K_YRA: return {
      '1cs': YUD + QAMATS + RESH + TSERE + ALEPH + TAV + HIRIQ + YUD,
      '2ms': YUD + QAMATS + RESH + TSERE + ALEPH + TAV + QAMATS,
      '2fs': YUD + QAMATS + RESH + TSERE + ALEPH + TAV + SHVA,
      '3ms': YUD + QAMATS + RESH + TSERE + ALEPH,
      '3fs': YUD + QAMATS + RESH + TSERE + ALEPH + QAMATS + HEY,
      '3cp': YUD + QAMATS + RESH + SHVA + ALEPH + VAV + DAGESH,
      '1cp': YUD + QAMATS + RESH + TSERE + ALEPH + NUN + VAV + DAGESH,
      '2mp': YUD + QAMATS + RESH + TSERE + ALEPH + TAV + SEGOL + MEM_S,
      '2fp': YUD + QAMATS + RESH + TSERE + ALEPH + TAV + SEGOL + NUN_S,
    };
    case K_NGS: return {
      '1cs': NUN + HIRIQ + GIMEL + PATACH + SHIN + SIN_D + SHVA + TAV + HIRIQ + YUD,
      '2ms': NUN + HIRIQ + GIMEL + PATACH + SHIN + SIN_D + SHVA + TAV + QAMATS,
      '2fs': NUN + HIRIQ + GIMEL + PATACH + SHIN + SIN_D + SHVA + TAV + SHVA,
      '3ms': NUN + HIRIQ + GIMEL + PATACH + SHIN + HOLAM,
      '3fs': NUN + HIRIQ + GIMEL + SHVA + SHIN + SIN_D + QAMATS + HEY,
      '3cp': NUN + HIRIQ + GIMEL + SHVA + SHIN + SIN_D + VAV + DAGESH,
      '1cp': NUN + HIRIQ + GIMEL + PATACH + SHIN + SIN_D + SHVA + NUN + VAV + DAGESH,
      '2mp': NUN + HIRIQ + GIMEL + PATACH + SHIN + SIN_D + SHVA + TAV + SEGOL + MEM_S,
      '2fp': NUN + HIRIQ + GIMEL + PATACH + SHIN + SIN_D + SHVA + TAV + SEGOL + NUN_S,
    };
    case K_NTN: return {
      '1cs': NUN + QAMATS + TAV + PATACH + TAV + HIRIQ + YUD,
      '2ms': NUN + QAMATS + TAV + PATACH + TAV + QAMATS,
      '2fs': NUN + QAMATS + TAV + PATACH + TAV + SHVA,
      '3ms': NUN + QAMATS + TAV + PATACH + NUN,
      '3fs': NUN + QAMATS + TAV + SHVA + NUN + QAMATS + HEY,
      '3cp': NUN + QAMATS + TAV + SHVA + NUN + VAV + DAGESH,
      '1cp': NUN + QAMATS + TAV + PATACH + NUN + VAV + DAGESH,
      '2mp': NUN + QAMATS + TAV + PATACH + TAV + SEGOL + MEM_S,
      '2fp': NUN + QAMATS + TAV + PATACH + TAV + SEGOL + NUN_S,
    };
    case K_HYH: return {
      '1cs': HEY + QAMATS + YUD + HIRIQ + YUD + TAV + HIRIQ + YUD,
      '2ms': HEY + QAMATS + YUD + HIRIQ + YUD + TAV + QAMATS,
      '2fs': HEY + QAMATS + YUD + HIRIQ + YUD + TAV + SHVA,
      '3ms': HEY + QAMATS + YUD + QAMATS + HEY,
      '3fs': HEY + QAMATS + YUD + SHVA + TAV + QAMATS + HEY,
      '3cp': HEY + QAMATS + YUD + VAV + DAGESH,
      '1cp': HEY + QAMATS + YUD + HIRIQ + YUD + NUN + VAV + DAGESH,
      '2mp': HEY + QAMATS + YUD + HIRIQ + YUD + TAV + SEGOL + MEM_S,
      '2fp': HEY + QAMATS + YUD + HIRIQ + YUD + TAV + SEGOL + NUN_S,
    };
    case K_CHH: return {
      '1cs': CHET + QAMATS + QAMATS + YUD + HIRIQ + YUD + TAV + HIRIQ + YUD,
      '2ms': CHET + QAMATS + QAMATS + YUD + HIRIQ + YUD + TAV + QAMATS,
      '2fs': CHET + QAMATS + QAMATS + YUD + HIRIQ + YUD + TAV + SHVA,
      '3ms': CHET + QAMATS + PATACH + YUD,
      '3fs': CHET + QAMATS + QAMATS + YUD + SHVA + TAV + QAMATS + HEY,
      '3cp': CHET + QAMATS + QAMATS + YUD + VAV + DAGESH,
      '1cp': CHET + QAMATS + QAMATS + YUD + HIRIQ + YUD + NUN + VAV + DAGESH,
      '2mp': CHET + QAMATS + QAMATS + YUD + HIRIQ + YUD + TAV + SEGOL + MEM_S,
      '2fp': CHET + QAMATS + QAMATS + YUD + HIRIQ + YUD + TAV + SEGOL + NUN_S,
    };
    case K_MVT: return {
      '1cs': MEM + TSERE + TAV + HIRIQ + YUD,
      '2ms': MEM + TSERE + TAV + QAMATS,
      '2fs': MEM + TSERE + TAV + SHVA,
      '3ms': MEM + TSERE + TAV,
      '3fs': MEM + TSERE + TAV + QAMATS + HEY,
      '3cp': MEM + TSERE + TAV + VAV + DAGESH,
      '1cp': MEM + PATACH + TAV + SHVA + NUN + VAV + DAGESH,
      '2mp': MEM + PATACH + TAV + SEGOL + MEM_S,
      '2fp': MEM + PATACH + TAV + SEGOL + NUN_S,
    };
    default: return null;
  }
}

// ================================================================
// FUTURE TENSE
// ================================================================
function computeFuture(root, infinitive) {
  const [R1, R2, R3] = root;
  const key = rk(root);

  // Default prefix sounds
  let ps_me  = SEGOL;   // 1cs: אֶ
  let ps_you = HIRIQ;   // 2ms/3ms/1cp: תִ/יִ/נִ
  let ps_pl  = HIRIQ;   // 2fs/2mp/3mp: תִ/יִ

  // Default future bases
  let base_me  = R1 + SHVA + R2 + VAV + HOLAM + R3;
  let base_you = R1 + SHVA + R2 + VAV + HOLAM + R3;
  let base_pl  = R1 + SHVA + R2 + SHVA + R3;

  // Exception future roots (use patach on R2)
  if (EXC_FUT_ROOTS.has(key)) {
    base_me  = R1 + SHVA + R2 + PATACH + R3;
    base_you = R1 + SHVA + R2 + PATACH + R3;
  }

  // Guttural R1 (ה, ח, ע) — not הלך
  if ([HEY, CHET, AYIN].includes(R1) && key !== K_HLK) {
    if (key === K_CNN) {
      const inf2 = infinitive ? infinitive.slice(2) : '';
      base_me = base_you = base_pl = inf2;
      ps_me = ps_you = ps_pl = QAMATS;
    } else if (PEI_XET_PRES_FUT.has(key)) {
      ps_me = ps_you = ps_pl = SEGOL;
      base_me = base_you = base_pl = R1 + SHVA + R2 + PATACH + R3;
    } else {
      ps_me = SEGOL;
      ps_you = ps_pl = PATACH;
      base_me  = R1 + HATAF_S + R2 + VAV + HOLAM + R3;
      base_you = R1 + HATAF_P + R2 + VAV + HOLAM + R3;
      base_pl  = R1 + PATACH + R2 + SHVA + R3;
    }
  }

  // Pe-aleph
  if (R1 === ALEPH) {
    const aPeSpecial = new Set([K_AHB, K_AKL, K_ABD, K_AAMR, K_ACZ]);
    if (aPeSpecial.has(key)) {
      ps_me = ps_you = ps_pl = HOLAM;
      base_me  = R2 + PATACH + R3;
      base_you = ALEPH + R2 + PATACH + R3;
      base_pl  = R2 === HEY ? ALEPH + R2 + HATAF_P + R3 : ALEPH + R2 + SHVA + R3;
    } else {
      ps_me = SEGOL; ps_you = SEGOL; ps_pl = PATACH;
      base_me  = ALEPH + HATAF_S + R2 + VAV + HOLAM + R3;
      base_you = ALEPH + HATAF_S + R2 + VAV + HOLAM + R3;
      base_pl  = ALEPH + PATACH + R2 + SHVA + R3;
    }
  }

  // Pe-yud or הלך
  if (R1 === YUD || key === K_HLK) {
    const peYudSet = new Set([K_HLK, K_YRD, K_YDA, K_YLD, K_YSB, K_YRS]);
    if (infinitive) {
      const infSlice = infinitive.slice(2);
      if ((infSlice === R2 + SEGOL + R3 + SEGOL + TAV || R3 === ALEPH) && key !== K_YRS) {
        ps_me = ps_you = ps_pl = TSERE;
        base_me = base_you = R2 + TSERE + R3;
        base_pl = R2 + SHVA + R3;
      } else if ([K_YTR, K_YZM].includes(key)) {
        ps_me = SEGOL; ps_you = ps_pl = HIRIQ;
        base_me  = R2 + VAV + HOLAM + R3;
        base_you = YUD + R2 + VAV + HOLAM + R3;
        base_pl  = YUD + R2 + SHVA + R3;
      } else if (infSlice === R2 + PATACH + R3 + PATACH + TAV) {
        ps_me = ps_you = ps_pl = TSERE;
        base_me = base_you = R2 + PATACH + R3;
        base_pl = R2 + SHVA + R3;
      } else {
        ps_me = ps_you = ps_pl = HIRIQ;
        base_me  = R1 + R2 + PATACH + R3;
        base_you = R1 + R2 + PATACH + R3;
        base_pl  = R1 + R2 + SHVA + R3;
      }
    }
  }

  // Pe-nun (not NUN_NORMAL, not לקח, not guttural R2)
  if ((R1 === NUN && !NUN_NORMAL.has(key)) || key === K_LQC) {
    if (!GUTTURAL.has(R2)) {
      ps_me = SEGOL; ps_you = ps_pl = HIRIQ;
      if (R3 === ALEPH) {
        base_me = base_you = R2 + QAMATS + ALEPH;
        base_pl = R2 + SHVA + ALEPH;
      } else {
        base_me = base_you = R2 + PATACH + R3;
        base_pl = R2 + SHVA + R3;
      }
      if ([K_NPL, K_NTS, K_NTR].includes(key)) {
        base_me = base_you = R2 + VAV + HOLAM + R3;
      }
    }
  }

  // Guttural R2 (not pe-aleph)
  if (GUTTURAL.has(R2) && R1 !== ALEPH) {
    ps_me = SEGOL; ps_you = ps_pl = HIRIQ;
    base_me = base_you = R1 + SHVA + R2 + PATACH + R3;
    base_pl = R1 + SHVA + R2 + HATAF_P + R3;
  }

  // Guttural R3 (ח/ע), not pe-yud/pe-nun, or כמה
  if (([CHET, AYIN].includes(R3) && ![YUD, NUN].includes(R1)) || key === K_KMH) {
    ps_me = SEGOL; ps_you = ps_pl = HIRIQ;
    base_me = base_you = R1 + SHVA + R2 + PATACH + R3;
    base_pl = R1 + SHVA + R2 + SHVA + R3;
  }

  // R3=aleph (not pe-yud/pe-nun)
  if (R3 === ALEPH && ![YUD, NUN].includes(R1)) {
    ps_me = SEGOL; ps_you = ps_pl = HIRIQ;
    base_me = base_you = R1 + SHVA + R2 + QAMATS + ALEPH;
    base_pl = GUTTURAL.has(R2) ? R1 + SHVA + R2 + HATAF_P + ALEPH : R1 + SHVA + R2 + SHVA + ALEPH;
  }

  // R3=ה (lamed-hey), not כמה
  if (R3 === HEY && key !== K_KMH) {
    if (R1 === AYIN) {
      ps_me = SEGOL; ps_you = ps_pl = PATACH;
      base_me  = R1 + HATAF_S + R2 + SEGOL + HEY;
      base_you = R1 + HATAF_P + R2 + SEGOL + HEY;
      base_pl  = R1 + HATAF_P + R2;
    } else if (R1 === HEY) {
      ps_me = ps_you = ps_pl = SEGOL;
      base_me = base_you = HEY + HATAF_S + R2 + SEGOL + HEY;
      base_pl = HEY + HATAF_S + R2;
    } else if (R1 === ALEPH) {
      ps_me = ps_you = ps_pl = HOLAM;
      base_me  = R2 + SEGOL + HEY;
      base_you = ALEPH + R2 + SEGOL + HEY;
      base_pl  = ALEPH + R2;
    } else {
      ps_me = R1 === YUD ? HIRIQ : SEGOL;
      ps_you = ps_pl = HIRIQ;
      if (R1 === YUD) {
        base_me = base_you = R1 + R2 + SEGOL + HEY;
        base_pl = R1 + R2;
      } else if (R1 === NUN) {
        base_me = base_you = R2 + SEGOL + HEY;
        base_pl = R2;
      } else {
        base_me = base_you = R1 + SHVA + R2 + SEGOL + HEY;
        base_pl = R1 + SHVA + R2;
      }
    }
  }

  // Hollow verbs (R2=ו/י, R3≠ה)
  if ([VAV, YUD].includes(R2) && R3 !== HEY) {
    ps_me = ps_you = ps_pl = QAMATS;
    if (R2 === VAV) {
      const vowelChar = infinitive && infinitive.length > 4 ? infinitive[4] : HOLAM;
      base_me = base_you = base_pl = R1 + VAV + vowelChar + R3;
    } else {
      base_me = base_you = base_pl = R1 + HIRIQ + YUD + R3;
    }
    if ([CHET, AYIN].includes(R3)) {
      base_me  += PATACH;
      base_you += PATACH;
    }
  }

  // Dagesh on begadkefat R2 (not pe-aleph/hey/yud/ayin)
  if (STRESS.has(R2) && ![ALEPH, HEY, YUD, AYIN].includes(R1)) {
    const stressPos = R1 === NUN ? 1 : 3;
    base_me  = ins(base_me, stressPos, DAGESH);
    base_you = ins(base_you, stressPos, DAGESH);
    base_pl  = ins(base_pl, stressPos, DAGESH);
  }

  // Build the person forms
  const f = {};
  f['1cs'] = ALEPH + ps_me + base_me;
  f['2ms'] = TAV + ps_you + base_you;
  f['3fs'] = TAV + ps_you + base_you;  // same as 2ms
  f['3ms'] = YUD + ps_you + base_you;
  f['1cp'] = NUN + ps_you + base_you;
  f['2fs'] = TAV + ps_pl + base_pl + HIRIQ + YUD;
  f['2mp'] = TAV + ps_pl + base_pl + VAV + DAGESH;
  f['3mp'] = YUD + ps_pl + base_pl + VAV + DAGESH;
  // 3fp / 2fp: standard derivation (same base as 3ms with נָה)
  f['3fp'] = TAV + ps_you + base_you + SHVA + NUN + QAMATS + HEY;
  f['2fp'] = TAV + ps_you + base_you + SHVA + NUN + QAMATS + HEY;

  // Exception roots — fully hardcoded (except מות which uses the computed form)
  if (EXC_ROOTS.has(key) && key !== K_MVT) {
    const e = futureException(key);
    if (e) return e;
  }

  return f;
}

function futureException(key) {
  switch (key) {
    case K_GBH: return {
      '1cs': ALEPH + SEGOL + GIMEL + SHVA + BET + DAGESH + PATACH + HEY,
      '2ms': TAV + HIRIQ + GIMEL + SHVA + BET + DAGESH + PATACH + HEY,
      '3fs': TAV + HIRIQ + GIMEL + SHVA + BET + DAGESH + PATACH + HEY,
      '3ms': YUD + HIRIQ + GIMEL + SHVA + BET + PATACH + DAGESH + HEY,
      '1cp': NUN + HIRIQ + GIMEL + SHVA + BET + DAGESH + PATACH + HEY,
      '2fs': TAV + HIRIQ + GIMEL + SHVA + BET + DAGESH + SHVA + HEY + HIRIQ + YUD,
      '2mp': TAV + HIRIQ + GIMEL + SHVA + BET + DAGESH + SHVA + HEY + VAV + DAGESH,
      '3mp': YUD + HIRIQ + GIMEL + SHVA + BET + DAGESH + SHVA + HEY + VAV + DAGESH,
      '3fp': TAV + HIRIQ + GIMEL + SHVA + BET + DAGESH + PATACH + HEY + SHVA + NUN + QAMATS + HEY,
      '2fp': TAV + HIRIQ + GIMEL + SHVA + BET + DAGESH + PATACH + HEY + SHVA + NUN + QAMATS + HEY,
    };
    case K_TMM: {
      const b = TAV + PATACH + MEM_S;
      return {
        '1cs': ALEPH + SEGOL + b,
        '2ms': TAV + HIRIQ + b, '3fs': TAV + HIRIQ + b,
        '3ms': YUD + HIRIQ + b, '1cp': NUN + HIRIQ + b,
        '2fs': TAV + HIRIQ + b + HIRIQ + YUD,
        '2mp': TAV + HIRIQ + b + VAV + DAGESH,
        '3mp': YUD + HIRIQ + b + VAV + DAGESH,
        '3fp': TAV + HIRIQ + b + SHVA + NUN + QAMATS + HEY,
        '2fp': TAV + HIRIQ + b + SHVA + NUN + QAMATS + HEY,
      };
    }
    case K_YKL: return {
      '1cs': ALEPH + VAV + DAGESH + KAF + PATACH + LAMED,
      '2ms': TAV + VAV + DAGESH + KAF + PATACH + LAMED,
      '3fs': TAV + VAV + DAGESH + KAF + PATACH + LAMED,
      '3ms': YUD + VAV + DAGESH + KAF + PATACH + LAMED,
      '1cp': NUN + VAV + DAGESH + KAF + PATACH + LAMED,
      '2fs': TAV + VAV + DAGESH + KAF + SHVA + LAMED + HIRIQ + YUD,
      '2mp': TAV + VAV + DAGESH + KAF + SHVA + LAMED + VAV + DAGESH,
      '3mp': YUD + VAV + DAGESH + KAF + SHVA + LAMED + VAV + DAGESH,
      '3fp': TAV + VAV + DAGESH + KAF + PATACH + LAMED + SHVA + NUN + QAMATS + HEY,
      '2fp': TAV + VAV + DAGESH + KAF + PATACH + LAMED + SHVA + NUN + QAMATS + HEY,
    };
    case K_NGS: {
      const b = GIMEL + PATACH + SHIN + SIN_D;
      return {
        '1cs': ALEPH + SEGOL + b, '2ms': TAV + HIRIQ + b,
        '3fs': TAV + HIRIQ + b, '3ms': YUD + HIRIQ + b,
        '1cp': NUN + HIRIQ + b,
        '2fs': TAV + HIRIQ + GIMEL + SHVA + SHIN + SIN_D + HIRIQ + YUD,
        '2mp': TAV + HIRIQ + GIMEL + SHVA + SHIN + SIN_D + VAV + DAGESH,
        '3mp': YUD + HIRIQ + GIMEL + SHVA + SHIN + SIN_D + VAV + DAGESH,
        '3fp': TAV + HIRIQ + b + SHVA + NUN + QAMATS + HEY,
        '2fp': TAV + HIRIQ + b + SHVA + NUN + QAMATS + HEY,
      };
    }
    case K_NTN: {
      const b = TAV + TSERE + NUN;
      return {
        '1cs': ALEPH + SEGOL + b, '2ms': TAV + HIRIQ + b,
        '3fs': TAV + HIRIQ + b, '3ms': YUD + HIRIQ + b,
        '1cp': NUN + HIRIQ + b,
        '2fs': TAV + HIRIQ + TAV + SHVA + NUN + HIRIQ + YUD,
        '2mp': TAV + HIRIQ + TAV + SHVA + NUN + VAV + DAGESH,
        '3mp': YUD + HIRIQ + TAV + SHVA + NUN + VAV + DAGESH,
        '3fp': TAV + HIRIQ + b + SHVA + NUN + QAMATS + HEY,
        '2fp': TAV + HIRIQ + b + SHVA + NUN + QAMATS + HEY,
      };
    }
    case K_HYH: return {
      '1cs': ALEPH + SEGOL + HEY + HATAF_S + YUD + SEGOL + HEY,
      '2ms': TAV + HIRIQ + HEY + SHVA + YUD + SEGOL + HEY,
      '3fs': TAV + HIRIQ + HEY + SHVA + YUD + SEGOL + HEY,
      '3ms': YUD + HIRIQ + HEY + SHVA + YUD + SEGOL + HEY,
      '1cp': NUN + HIRIQ + HEY + SHVA + YUD + SEGOL + HEY,
      '2fs': TAV + HIRIQ + HEY + SHVA + YUD + HIRIQ + YUD,
      '2mp': TAV + HIRIQ + HEY + SHVA + YUD + HIRIQ + VAV + DAGESH,
      '3mp': YUD + HIRIQ + HEY + SHVA + YUD + VAV + DAGESH,
      '3fp': TAV + HIRIQ + HEY + SHVA + YUD + SEGOL + HEY + SHVA + NUN + QAMATS + HEY,
      '2fp': TAV + HIRIQ + HEY + SHVA + YUD + SEGOL + HEY + SHVA + NUN + QAMATS + HEY,
    };
    case K_CHH: return {
      '1cs': ALEPH + SEGOL + CHET + SHVA + YUD + SEGOL + HEY,
      '2ms': TAV + HIRIQ + CHET + SHVA + YUD + SEGOL + HEY,
      '3fs': TAV + HIRIQ + CHET + SHVA + YUD + SEGOL + HEY,
      '3ms': YUD + HIRIQ + CHET + SHVA + YUD + SEGOL + HEY,
      '1cp': NUN + HIRIQ + CHET + SHVA + YUD + SEGOL + HEY,
      '2fs': TAV + HIRIQ + CHET + SHVA + YUD + HIRIQ + YUD,
      '2mp': TAV + HIRIQ + CHET + SHVA + YUD + HIRIQ + VAV + DAGESH,
      '3mp': YUD + HIRIQ + CHET + SHVA + YUD + VAV + DAGESH,
      '3fp': TAV + HIRIQ + CHET + SHVA + YUD + SEGOL + HEY + SHVA + NUN + QAMATS + HEY,
      '2fp': TAV + HIRIQ + CHET + SHVA + YUD + SEGOL + HEY + SHVA + NUN + QAMATS + HEY,
    };
    default: return null;
  }
}

// ================================================================
// IMPERATIVE — derived from future tense
// ================================================================
function computeImperative(root, futForms) {
  const [R1, R2, R3] = root;
  const key = rk(root);

  // Base: strip the prefix letter + vowel (first 2 chars) from relevant future forms
  let mas = futForms['2ms'] ? futForms['2ms'].slice(2) : '';
  let fem = futForms['2fs'] ? futForms['2fs'].slice(2) : '';
  let plu = futForms['2mp'] ? futForms['2mp'].slice(2) : '';

  // Guttural R1 (ה, ח, ע) — not הלך/חנן
  if ([HEY, CHET, AYIN].includes(R1) && ![K_HLK, K_CNN].includes(key)) {
    if (mas.length > 1) mas = mas[0] + HATAF_P + mas.slice(2);
    if (fem.length > 1) fem = fem[0] + HIRIQ + fem.slice(2);
    if (plu.length > 1) plu = plu[0] + HIRIQ + plu.slice(2);
  }

  // Pe-aleph
  if (R1 === ALEPH && key !== K_AHD && R3 !== HEY) {
    if (key === K_AHB) {
      mas = ins(mas, 1, HATAF_S);
      fem = ins(fem, 1, PATACH);
      plu = ins(plu, 1, PATACH);
    } else if ([K_AKL, K_ABD, K_AAMR, K_ACZ].includes(key)) {
      mas = ins(mas, 1, HATAF_S);
      if (mas.length > 3) mas = mas.slice(0, 3) + HOLAM + mas.slice(4);
      fem = ins(fem, 1, HIRIQ);
      plu = ins(plu, 1, HIRIQ);
    } else {
      if (fem.length > 1) fem = fem[0] + HIRIQ + fem.slice(2);
      if (plu.length > 1) plu = plu[0] + HIRIQ + plu.slice(2);
    }
  }

  // Pe-yud
  if (R1 === YUD) {
    const peYudSpec = new Set([K_HLK, K_YRD, K_YDA, K_YLD, K_YSB, K_YRS]);
    if (!peYudSpec.has(key) || key === K_YRS) {
      if ([K_YTR, rk([YUD, SHIN, NUN]), K_YRS].includes(key)) {
        mas = mas.slice(1);
        fem = fem.slice(1);
        plu = plu.slice(1);
      } else if (GUTTURAL.has(R2)) {
        if (mas.length > 1) mas = mas[0] + SHVA + mas.slice(2);
        if (fem.length > 1) fem = fem[0] + PATACH + fem.slice(2);
        if (plu.length > 1) plu = plu[0] + PATACH + plu.slice(2);
      } else if ([ZAYIN, RESH].includes(R2)) {
        mas = ins(mas, 1, SHVA);
        fem = ins(fem, 1, HIRIQ);
        plu = ins(plu, 1, HIRIQ);
      } else if (key === K_YGA) {
        mas = ins(mas, 1, SHVA);
        fem = ins(fem, 1, HIRIQ);
        plu = ins(plu, 1, HIRIQ);
      }
    }
  }

  // Pe-nun (not NUN_NORMAL)
  if (R1 === NUN && !NUN_NORMAL.has(key)) {
    if (futForms['1cs'] && futForms['1cs'].length > 2 && futForms['1cs'].slice(-2, -1) === HOLAM) {
      mas = NUN + SHVA + mas;
      fem = NUN + HIRIQ + fem;
      plu = NUN + HIRIQ + plu;
    }
  }

  // Guttural R2
  if (GUTTURAL.has(R2)) {
    if (fem.length > 1) fem = fem[0] + PATACH + fem.slice(2);
    if (plu.length > 1) plu = plu[0] + PATACH + plu.slice(2);
  }

  // Guttural R3
  if (GUTTURAL.has(R3) && key !== K_BVA && (![YUD, NUN].includes(R1) || [K_YRH, K_NTH].includes(key))) {
    if (R3 === HEY && ![K_KMH, K_GBH].includes(key)) {
      if (R1 === NUN) {
        mas = NUN + SHVA + mas;
        fem = NUN + SHVA + fem;
        plu = NUN + SHVA + plu;
      } else if ([HEY, CHET, AYIN].includes(R1)) {
        if (fem.length > 1) fem = fem[0] + HATAF_P + fem.slice(2);
        if (plu.length > 1) plu = plu[0] + HATAF_P + plu.slice(2);
      } else if (R1 === ALEPH) {
        mas = ins(mas, 1, HATAF_S);
        fem = ins(fem, 1, HATAF_S);
        plu = ins(plu, 1, HATAF_S);
      } else {
        if (fem.length > 1) fem = fem[0] + SHVA + fem.slice(2);
        if (plu.length > 1) plu = plu[0] + SHVA + plu.slice(2);
      }
      const tserePos = STRESS.has(R2) && key !== K_APH ? 4 : 3;
      if (mas.length > tserePos) {
        mas = mas.slice(0, tserePos) + TSERE + mas.slice(tserePos + 1);
      }
    } else {
      if (fem.length > 1) fem = fem[0] + HIRIQ + fem.slice(2);
      if (plu.length > 1) plu = plu[0] + HIRIQ + plu.slice(2);
    }
    if (R2 === CHET) {
      if (fem.length > 3) fem = fem.slice(0, 3) + SHVA + fem.slice(4);
      if (plu.length > 3) plu = plu.slice(0, 3) + SHVA + plu.slice(4);
    }
  }

  // Non-guttural verb adjustments
  const isNonGuttural = ![...root].some(l => GUTTURAL.has(l));

  if ([YUD, NUN].includes(R1) && fem[0] === R1 && !GUTTURAL.has(R2)) {
    if (fem.length > 1) fem = fem[0] + HIRIQ + fem.slice(2);
    if (plu.length > 1) plu = plu[0] + HIRIQ + plu.slice(2);
  }

  if (isNonGuttural && R2 !== VAV && ![YUD, NUN].includes(R1)) {
    if (fem.length > 1) fem = fem[0] + HIRIQ + fem.slice(2);
    if (plu.length > 1) plu = plu[0] + HIRIQ + plu.slice(2);
  }

  // Remove extra dagesh position for begadkefat R2
  if (STRESS.has(R2) && ![ALEPH, HEY, YUD, AYIN].includes(R1)) {
    if (mas.length > 3) mas = mas.slice(0, 3) + mas.slice(4);
    if (fem.length > 3) fem = fem.slice(0, 3) + fem.slice(4);
    if (plu.length > 3) plu = plu.slice(0, 3) + plu.slice(4);
  }

  // Dagesh on begadkefat R1
  if (STRESS.has(R1)) {
    mas = ins(mas, 1, DAGESH);
    fem = ins(fem, 1, DAGESH);
    plu = ins(plu, 1, DAGESH);
  }

  // Exception root imperatives
  if (EXC_ROOTS.has(key)) {
    const e = imperativeException(key, { mas, fem, plu });
    if (e) { mas = e.mas; fem = e.fem; plu = e.plu; }
  }

  return { '2ms': mas, '2fs': fem, '2mp': plu, '2fp': mas + SHVA + NUN + QAMATS + HEY };
}

function imperativeException(key, base) {
  switch (key) {
    case K_TMM: return {
      mas: TAV + HOLAM + MEM,
      fem: TAV + HOLAM + MEM + HIRIQ + YUD,
      plu: TAV + HOLAM + MEM + VAV + DAGESH,
    };
    case K_YKL: return { mas: null, fem: null, plu: null };
    case K_HYH: return {
      mas: HEY + HATAF_S + YUD + TSERE + HEY,
      fem: HEY + HATAF_P + YUD + HIRIQ + YUD,
      plu: HEY + HATAF_S + YUD + VAV + DAGESH,
    };
    case K_GBH: return base;
    case K_NGS: return base;
    case K_NTN: return base;
    case K_CHH: return base;
    case K_MVT: return base;
    default: return null;
  }
}

// ================================================================
// MAIN ENTRY POINT — builds a template-compatible object
// ================================================================
export function buildQalTemplate(root) {
  const part = computeParticiple(root);
  const inf  = computeInfinitive(root);
  const past = computePast(root, part.pastBase);
  const fut  = computeFuture(root, inf);
  const imp  = computeImperative(root, fut);

  // Standard passive participle (qatul pattern, no exception handling)
  const [R1, R2, R3] = root;
  const pvMs = R1 + QAMATS + R2 + VAV + DAGESH + R3;
  const pvFs = R1 + SHVA + R2 + VAV + DAGESH + R3 + QAMATS + HEY;
  const pvMp = R1 + SHVA + R2 + VAV + DAGESH + R3 + HIRIQ + YUD + MEM_S;
  const pvFp = R1 + SHVA + R2 + VAV + DAGESH + R3 + VAV + HOLAM + TAV;

  const template = {
    activeParticiple: [
      { person: 'ms', form: () => part.ms },
      { person: 'fs', form: () => part.fs },
      { person: 'mp', form: () => part.mp },
      { person: 'fp', form: () => part.fp },
    ],
    passiveParticiple: [
      { person: 'ms', form: () => pvMs },
      { person: 'fs', form: () => pvFs },
      { person: 'mp', form: () => pvMp },
      { person: 'fp', form: () => pvFp },
    ],
    infinitive: [
      { person: 'inf', form: () => inf },
    ],
    past: [
      { person: '3ms', form: () => past['3ms'] },
      { person: '3fs', form: () => past['3fs'] },
      { person: '2ms', form: () => past['2ms'] },
      { person: '2fs', form: () => past['2fs'] },
      { person: '1cs', form: () => past['1cs'] },
      { person: '3cp', form: () => past['3cp'] },
      { person: '2mp', form: () => past['2mp'] },
      { person: '2fp', form: () => past['2fp'] },
      { person: '1cp', form: () => past['1cp'] },
    ],
    future: [
      { person: '3ms', form: () => fut['3ms'] },
      { person: '3fs', form: () => fut['3fs'] },
      { person: '2ms', form: () => fut['2ms'] },
      { person: '2fs', form: () => fut['2fs'] },
      { person: '1cs', form: () => fut['1cs'] },
      { person: '3mp', form: () => fut['3mp'] },
      { person: '3fp', form: () => fut['3fp'] },
      { person: '2mp', form: () => fut['2mp'] },
      { person: '2fp', form: () => fut['2fp'] },
      { person: '1cp', form: () => fut['1cp'] },
    ],
    imperative: [
      { person: '2ms', form: () => imp['2ms'] },
      { person: '2fs', form: () => imp['2fs'] },
      { person: '2mp', form: () => imp['2mp'] },
      { person: '2fp', form: () => imp['2fp'] },
    ],
  };

  // Filter out null forms (non-existent for some exception roots)
  for (const tenseKey of Object.keys(template)) {
    template[tenseKey] = template[tenseKey].filter(entry => entry.form() !== null);
  }

  return template;
}
