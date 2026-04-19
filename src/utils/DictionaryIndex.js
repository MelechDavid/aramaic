// This file provides a lightweight, pre-processed index of the Jastrow dictionary
// for faster searching and better performance

class DictionaryIndex {
  constructor() {
    this.entries = null;
    this.isLoading = false;
    this.isLoaded = false;
    this.entryDetailsCache = {}; // Add a cache for entry details
  }

  // Remove vowel marks (nikkud) and normalize Hebrew final forms (sofit letters)
  removeVowels(text) {
    return text
      .replace(/[\u0591-\u05C7]/g, '') // strip nikkud
      .replace(/\u05DA/g, '\u05DB')    // ך → כ (kaf sofit)
      .replace(/\u05DD/g, '\u05DE')    // ם → מ (mem sofit)
      .replace(/\u05DF/g, '\u05E0')    // ן → נ (nun sofit)
      .replace(/\u05E3/g, '\u05E4')    // ף → פ (pe sofit)
      .replace(/\u05E5/g, '\u05E6');   // ץ → צ (tsadi sofit)
  }

  // Load and pre-process the XML file
  async loadDictionary() {
    if (this.isLoading || this.isLoaded) return this.entries;
    
    try {
      this.isLoading = true;
      
      // Fetch the XML file
      const response = await fetch('/data/Jastrow-full.xml');
      if (!response.ok) {
        throw new Error(`Failed to fetch XML: ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      
      // Parse XML using DOMParser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      console.log("XML document loaded for indexing");
      
      // Build the lightweight index
      const entries = [];
      const xmlEntries = xmlDoc.querySelectorAll('entry');
      
      xmlEntries.forEach(entry => {
        // Only include entries with headwords AND italicized terms
        const headWordElements = entry.querySelectorAll('head-word');
        const italicElements = entry.querySelectorAll('definition italic');
        
        if (headWordElements.length > 0 && italicElements.length > 0) {
          const headwords = Array.from(headWordElements).map(hw => hw.textContent.trim());
          
          // Create an index entry with essential information
          entries.push({
            id: entry.getAttribute('id'),
            headwords: headwords,
            // Store normalized versions for searching without vowels
            headwordsNormalized: headwords.map(hw => this.removeVowels(hw.toLowerCase())),
            englishTerms: Array.from(italicElements).map(italic => italic.textContent.trim())
          });
        }
      });
      
      this.entries = entries;
      this.isLoaded = true;
      this.isLoading = false;
      
      console.log(`Dictionary index created with ${entries.length} entries`);
      return this.entries;
      
    } catch (error) {
      console.error("Error creating dictionary index:", error);
      this.isLoading = false;
      throw error;
    }
  }

  // Calculate relevance score for an entry
  calculateRelevance(entry, searchTerm, isHebrewSearch, termWithoutVowels) {
    let score = 0;
    
    if (isHebrewSearch) {
      // Take the best score from any single headword (don't accumulate across headwords,
      // which would let multi-headword entries with weak matches outscore exact matches)
      let highestScore = 0;

      for (let i = 0; i < entry.headwords.length; i++) {
        const hwNormalized = entry.headwordsNormalized[i];
        let hwScore = 0;

        if (hwNormalized === termWithoutVowels) {
          // Tier 1: exact match
          hwScore = 1000;
        } else if (
          hwNormalized.startsWith(termWithoutVowels) &&
          hwNormalized.length === termWithoutVowels.length + 1
        ) {
          // Tier 2: exactly one extra letter appended to the end
          hwScore = 800;
        } else if (hwNormalized.startsWith(termWithoutVowels)) {
          // Tier 3: starts with the term (two or more extra letters)
          hwScore = 600;
        } else if (
          hwNormalized.includes(` ${termWithoutVowels}`) ||
          hwNormalized.includes(`${termWithoutVowels} `)
        ) {
          // Tier 4: term appears as a whole word within a multi-word headword
          hwScore = 300;
        } else if (hwNormalized.includes(termWithoutVowels)) {
          // Tier 5: term appears embedded anywhere inside a longer word
          hwScore = 100;
        }

        highestScore = Math.max(highestScore, hwScore);
      }

      score += highestScore;
    } else {
      // Enhanced English search with stronger word boundary prioritization
      
      // Use word boundary regex, escape special regex characters in the search term
      const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const exactWordRegex = new RegExp(`\\b${escapedTerm}\\b`, 'i');
      const wordStartRegex = new RegExp(`\\b${escapedTerm}`, 'i');
      const wordEndRegex = new RegExp(`${escapedTerm}\\b`, 'i');
      
      // Check if the search term is a common English word
      const isCommonWord = /^(a|an|the|to|of|in|on|for|with|by|at)$/i.test(searchTerm);
      
      let highestScore = 0; // Track highest score among all English terms for this entry
      
      for (const engTerm of entry.englishTerms) {
        const termLower = engTerm.toLowerCase();
        let termScore = 0;
        
        // Case 1: The entire term exactly matches the search term
        if (termLower === searchTerm) {
          termScore = isCommonWord ? 500 : 1000;
        }
        // Case 2: Term has the search term as a distinct word
        else if (exactWordRegex.test(termLower)) {
          // Count how many times the word appears
          const matches = termLower.match(new RegExp(`\\b${escapedTerm}\\b`, 'gi')) || [];
          const matchCount = matches.length;
          
          // Prioritize entries where the search term appears as a distinct word
          termScore = (isCommonWord ? 300 : 500) * matchCount;
          
          // Boost shorter phrases that contain the exact word
          if (termLower.split(/\s+/).length <= 3) {
            termScore += 100;
          }
          
          // Additional boost if term starts with the search term as a distinct word
          if (wordStartRegex.test(termLower) && termLower.startsWith(searchTerm + ' ')) {
            termScore += 200;
          }
        }
        // Case 3: Term contains the search term but not as a distinct word
        else if (termLower.includes(searchTerm)) {
          // Much lower score for embedded partial matches
          termScore = 50;
          
          // Special cases where partial matching is more relevant
          if (termLower.startsWith(searchTerm)) {
            termScore += 30;
          }
          
          // Heavily penalize cases where the search term is embedded inside another word
          // For example, when searching "see", penalize "seed" or "oversee"
          if (
            // Check if there's a letter immediately before
            (termLower.indexOf(searchTerm) > 0 && 
             /[a-z]/.test(termLower.charAt(termLower.indexOf(searchTerm) - 1))) ||
            // Or a letter immediately after
            (/[a-z]/.test(termLower.charAt(termLower.indexOf(searchTerm) + searchTerm.length)))
          ) {
            termScore -= 40;
          }
        }
        
        // Apply length penalty for very long phrases unless they have exact word matches
        if (termLower.length > 20 && !exactWordRegex.test(termLower)) {
          termScore -= Math.min(termScore - 10, (termLower.length - 20) / 2);
        }
        
        // Keep track of the highest score from any English term
        highestScore = Math.max(highestScore, termScore);
      }
      
      // Use the highest individual term score for this entry
      score += highestScore;
    }
    
    return score;
  }

  // Search the index for matching entries
  async search(searchTerm, limit = 50, skip = 0) {
    if (!this.isLoaded && !this.isLoading) {
      await this.loadDictionary();
    } else if (this.isLoading) {
      // Wait for loading to complete
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    const term = searchTerm.toLowerCase().trim();
    const isHebrewSearch = /[\u0590-\u05FF]/.test(term);
    const termWithoutVowels = isHebrewSearch ? this.removeVowels(term) : term;
    
    const matchingEntries = [];
    
    // Search through the index and calculate relevance scores
    for (const entry of this.entries) {
      let isMatch = false;
      
      // Match Aramaic/Hebrew terms
      if (isHebrewSearch) {
        isMatch = entry.headwordsNormalized.some(hw => 
          hw.includes(termWithoutVowels)
        );
      }
      
      // Match English terms
      if (!isMatch) {
        isMatch = entry.englishTerms.some(engTerm => 
          engTerm.toLowerCase().includes(term) || 
          engTerm.toLowerCase().split(/,\s*|\s+/).some(word => word === term)
        );
      }
      
      if (isMatch) {
        // Calculate relevance score for this entry
        const relevanceScore = this.calculateRelevance(entry, term, isHebrewSearch, termWithoutVowels);
        
        matchingEntries.push({
          ...entry,
          relevanceScore
        });
      }
    }
    
    // Sort entries by relevance score (highest first)
    matchingEntries.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    // Apply pagination
    const paginatedResults = matchingEntries.slice(skip, skip + limit);
    
    return {
      results: paginatedResults,
      totalCount: matchingEntries.length
    };
  }

  // Get full entry details by ID
  async getEntryDetails(entryId) {
    // Check cache first
    if (this.entryDetailsCache[entryId]) {
      console.log(`Using cached details for entry ${entryId}`);
      return this.entryDetailsCache[entryId];
    }

    try {
      console.log(`Fetching XML details for entry ${entryId}`);
      
      // Fetch the XML file
      const response = await fetch('/data/Jastrow-full.xml');
      if (!response.ok) {
        throw new Error(`Failed to fetch XML: ${response.statusText}`);
      }
      
      const xmlText = await response.text();
      
      // Parse XML using DOMParser
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      // Find the specific entry by ID
      const entry = xmlDoc.querySelector(`entry[id="${entryId}"]`);
      
      if (!entry) {
        throw new Error(`Entry with ID ${entryId} not found`);
      }
      
      // Extract headwords and English terms for the basic entry structure
      const headwords = Array.from(entry.querySelectorAll('head-word'))
        .map(hw => hw.textContent.trim());
        
      const englishTerms = Array.from(entry.querySelectorAll('definition italic'))
        .map(italic => italic.textContent.trim());
      
      // Process the complete entry, preserving all content as in the XML structure
      const processEntryContent = (entry) => {
        // Function to convert XML nodes to formatted text
        const processNode = (node) => {
          let text = '';
          
          // Handle different node types
          if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
          }
          
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            
            switch (tagName) {
              case 'entry':
                // Process main entry content
                // Wrap headwords in RTL span so they display in the same order as the title
                let headwordsHtml = '';
                let contentHtml = '';
                let pastHeadwords = false;
                for (let child of node.childNodes) {
                  if (!pastHeadwords) {
                    const isHW = child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'head-word';
                    const isHWNum = child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'hw-number';
                    const isWhitespace = child.nodeType === Node.TEXT_NODE && child.textContent.trim() === '';
                    if (isHW || isHWNum || isWhitespace) {
                      headwordsHtml += processNode(child);
                      continue;
                    }
                    pastHeadwords = true;
                  }
                  contentHtml += processNode(child);
                }
                return (headwordsHtml ? `<span dir="rtl">${headwordsHtml}</span>` : '') + contentHtml;
              
              case 'head-word':
                // Main entry headword - format prominently
                return `<span class="font-bold text-xl">${node.textContent.trim()}</span> `;
              
              case 'hw-number':
                // Handle Roman numerals for homographs
                return `<span class="font-semibold text-lg">${node.textContent.trim()}</span> `;
              
              case 'language-key':
                // Handle language origin info
                return node.textContent.trim() + ' ';
              
              case 'language-reference':
                // Handle root & cross-references
                let refText = '';
                for (let child of node.childNodes) {
                  refText += processNode(child);
                }
                return refText;
              
              case 'xref':
                // Cross references to other entries - render as plain text instead of links
                return node.textContent.trim();
              
              case 'senses':
                // Process all senses
                let sensesText = '';
                for (let child of node.childNodes) {
                  sensesText += processNode(child);
                }
                return sensesText;
              
              case 'sense':
                // Process a single sense
                let senseText = '';
                for (let child of node.childNodes) {
                  senseText += processNode(child);
                }
                return senseText;
              
              case 'number':
                // Section numbers within definitions
                return `<span class="font-semibold">${node.textContent.trim()}</span> `;
              
              case 'definition':
                // Definition text with proper formatting
                let defText = '';
                for (let child of node.childNodes) {
                  defText += processNode(child);
                }
                return defText;
              
              case 'notes':
                // Notes with additional details
                let noteText = '';
                for (let child of node.childNodes) {
                  noteText += processNode(child);
                }
                return noteText;
              
              case 'italic':
                // Italic text for emphasis
                return `<i>${node.textContent.trim()}</i> `;
              
              case 'sup':
                // Superscript for footnotes or references
                return `<sup>${node.textContent.trim()}</sup>`;
              
              case 'pgbrk':
                // Page breaks - ignore in web view
                return '';
              
              case 'binyan':
                // Hebrew grammatical form (binyan)
                let binyanText = '\n';
                
                // Process the binyan name and form
                const binyanName = node.querySelector('binyan-name');
                const binyanForm = node.querySelector('binyan-form');
                
                if (binyanName) {
                  binyanText += `<span class="font-bold">${binyanName.textContent.trim()}</span>`;
                  
                  if (binyanForm) {
                    binyanText += ` - <span class="font-semibold">${binyanForm.textContent.trim()}</span> `;
                  } else {
                    binyanText += ' ';
                  }
                }
                
                // Process all senses within the binyan
                const binyanSenses = node.querySelector('senses');
                if (binyanSenses) {
                  for (let child of binyanSenses.childNodes) {
                    binyanText += processNode(child);
                  }
                }
                
                return binyanText;
              
              // Handle any other elements by processing their children
              default:
                let childText = '';
                for (let child of node.childNodes) {
                  childText += processNode(child);
                }
                return childText;
            }
          }
          
          return '';
        };
        
        return processNode(entry);
      };
      
      // Process complete entry data
      const completeDefinition = processEntryContent(entry);

      // Detect if entry is Aramaic (Chaldean) or Hebrew
      const languageKey = entry.querySelector('language-key');
      let isAramaic = languageKey ? /\bch\.?\b/i.test(languageKey.textContent) : false;
      let isHebrew = languageKey ? /b\.\s*h\./i.test(languageKey.textContent) : false;

      // Extract binyan information
      const binyanElements = entry.querySelectorAll('binyan');
      const binyanim = Array.from(binyanElements).map(b => {
        const nameEl = b.querySelector('binyan-name');
        const formEl = b.querySelector('binyan-form');
        return {
          name: nameEl ? nameEl.textContent.trim() : '',
          form: formEl ? formEl.textContent.trim() : '',
        };
      }).filter(b => b.name);

      // If language not detected from <language-key>, check definition text and binyan names
      if (!isAramaic && !isHebrew && binyanim.length > 0) {
        // Check definition text for language markers like (b. h.) or (ch.)
        const firstDef = entry.querySelector('definition');
        const defText = firstDef ? firstDef.textContent : '';
        if (/\bb\.\s*h\./i.test(defText)) {
          isHebrew = true;
        } else if (/\bch\.?\b/i.test(defText)) {
          isAramaic = true;
        }

        // If still not detected, infer from binyan names
        if (!isAramaic && !isHebrew) {
          const hebrewBinyanPattern = /^(Nif|Pi|Pu|Hif|Hof|Hithpa|Nithpa)\./;
          const aramaicBinyanPattern = /^(Pa|Af|Ithpe|Ithpa|Ittaf|Ishtaf|Pe|Palp|Ithpalp)\./;
          const hasHebrewBinyan = binyanim.some(b => hebrewBinyanPattern.test(b.name));
          const hasAramaicBinyan = binyanim.some(b => aramaicBinyanPattern.test(b.name));
          if (hasHebrewBinyan) isHebrew = true;
          if (hasAramaicBinyan) isAramaic = true;
        }
      }

      // Extract separate notes section (for backward compatibility)
      const notes = Array.from(entry.querySelectorAll('sense notes'))
          .map(note => {
            let noteText = '';
            for (let child of note.childNodes) {
              if (child.nodeType === Node.TEXT_NODE) {
                noteText += child.textContent;
              } else if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.tagName.toLowerCase() === 'italic') {
                  noteText += `<i>${child.textContent}</i>`;
                } else {
                  noteText += child.textContent;
                }
              }
            }
            return noteText;
          })
          .join("<br/>");
      
      // Create the complete entry details object
      const details = {
        id: entryId,
        headwords,
        englishTerms,
        definition: completeDefinition,
        notes: notes,
        isAramaic,
        isHebrew,
        binyanim,
      };
      
      // Cache the details for future use
      this.entryDetailsCache[entryId] = details;
      
      return details;
      
    } catch (error) {
      console.error("Error fetching entry details:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const dictionaryIndex = new DictionaryIndex();

export default dictionaryIndex;