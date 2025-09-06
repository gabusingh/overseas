// Simple function to extract occupations from jobs
export const extractOccupationsFromJobs = (jobs: any[], limit: number = 8) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return [];
  }

  const occupationCount: { [key: string]: { count: number; jobIds: number[] } } = {};
  
  // Extract occupations from jobs
  jobs.forEach((job, index) => {
    const jobId = job.id || index;

    // Extract ONLY from occupation field (job category like "Fabrication and Welding")
    // Based on jobdata.md: job.occupation contains the job category
    const occupation = job.occupation; // Primary field from API
    if (occupation && typeof occupation === 'string') {
      const cleanedOccupation = cleanOccupation(occupation);
      if (cleanedOccupation) {
        if (!occupationCount[cleanedOccupation]) {
          occupationCount[cleanedOccupation] = { count: 0, jobIds: [] };
        }
        occupationCount[cleanedOccupation].count += 1;
        if (!occupationCount[cleanedOccupation].jobIds.includes(jobId)) {
          occupationCount[cleanedOccupation].jobIds.push(jobId);
        }
      }
    }
  });
  // Convert to format and sort by job count
  const occupations = Object.entries(occupationCount)
    .filter(([occupation, data]) => data.jobIds.length > 0)
    .map(([occupation, data], index) => ({
      label: occupation,
      value: index + 1,
      img: "/images/institute.png",
      searchCount: data.count
    }))
    .sort((a, b) => b.searchCount - a.searchCount)
    .slice(0, limit);
    
  return occupations;
};

// Clean occupation names
function cleanOccupation(occupation: string): string | null {
  if (!occupation || typeof occupation !== 'string') return null;
  
  let cleaned = occupation
    .trim()
    .replace(/^(job|position|role|work|employment)\s+/gi, '') // Remove job prefixes
    .replace(/\s+(job|position|role|work|employment)$/gi, '') // Remove job suffixes
    .replace(/^(urgent|immediate|hiring|required|needed)\s+/gi, '') // Remove urgency prefixes
    .replace(/\s+(urgent|immediate|hiring|required|needed)$/gi, '') // Remove urgency suffixes
    .replace(/^\d+\s+/, '') // Remove leading numbers
    .replace(/\s+\d+$/, '') // Remove trailing numbers
    .replace(/[^\w\s-&]/g, '') // Keep letters, spaces, hyphens, and ampersands
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Filter out very short or very long occupation names
  if (cleaned.length < 2 || cleaned.length > 40) return null;
  
  // Filter out generic non-occupation terms
  const stopWords = ['job', 'work', 'employment', 'position', 'role', 'hiring', 'urgent', 'immediate', 'required', 'needed', 'vacancy', 'apply', 'now', 'available', 'open'];
  if (stopWords.includes(cleaned.toLowerCase())) return null;
  
  // Don't filter out single character occupations (like 'IT')
  if (cleaned.length === 1) return null;
  
  // Capitalize properly for occupation names
  return cleaned.split(' ')
    .map(word => {
      // Keep common occupation abbreviations in uppercase
      if (['IT', 'HR', 'QA', 'QC', 'AC', 'HVAC'].includes(word.toUpperCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

export default extractOccupationsFromJobs;
