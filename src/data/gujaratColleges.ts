/**
 * Static list of major Gujarat colleges.
 * Used as fallback seed data when Supabase has no colleges loaded.
 * Each college has a stable slug-based ID so it works without a DB.
 */

export interface StaticCollege {
  id: string
  name: string
  city: string
}

export interface StaticBranch {
  id: string
  name: string
  college_id: string
}

/** Common engineering / BCA branches offered at most Gujarat colleges */
const COMMON_BRANCHES: Omit<StaticBranch, 'college_id'>[] = [
  { id: 'ce',   name: 'Computer Engineering' },
  { id: 'it',   name: 'Information Technology' },
  { id: 'ec',   name: 'Electronics & Communication Engineering' },
  { id: 'me',   name: 'Mechanical Engineering' },
  { id: 'ce2',  name: 'Civil Engineering' },
  { id: 'ee',   name: 'Electrical Engineering' },
  { id: 'bca',  name: 'BCA (Bachelor of Computer Applications)' },
  { id: 'mca',  name: 'MCA (Master of Computer Applications)' },
  { id: 'ai',   name: 'Artificial Intelligence & Data Science' },
  { id: 'cyber',name: 'Cyber Security' },
]

export const gujaratColleges: StaticCollege[] = [
  // Ahmedabad
  { id: 'nirma',      name: 'Nirma University',                                       city: 'Ahmedabad' },
  { id: 'ldrp',       name: 'LDRP Institute of Technology and Research',               city: 'Ahmedabad' },
  { id: 'silver',     name: 'Silver Oak University',                                   city: 'Ahmedabad' },
  { id: 'sap',        name: 'SAL College of Engineering',                              city: 'Ahmedabad' },
  { id: 'gift',       name: 'GIFT University',                                         city: 'Ahmedabad' },
  { id: 'adit',       name: 'ADIT – Anand College',                                   city: 'Ahmedabad' },
  { id: 'cgpit',      name: 'CGPIT – Uka Tarsadia University',                        city: 'Ahmedabad' },
  { id: 'ld',         name: 'LD College of Engineering',                               city: 'Ahmedabad' },
  { id: 'pvpit',      name: 'PVPIT – Pune Vidyarthi Griha',                           city: 'Ahmedabad' },
  { id: 'acet',       name: 'Ahmedabad College of Engineering & Technology (ACET)',    city: 'Ahmedabad' },
  { id: 'karnavati',  name: 'Karnavati University',                                    city: 'Ahmedabad' },
  { id: 'marwadi_a',  name: 'Marwadi University (Ahmedabad Campus)',                   city: 'Ahmedabad' },

  // Surat
  { id: 'svnit',      name: 'SVNIT – Sardar Vallabhbhai National Institute of Technology', city: 'Surat' },
  { id: 'bvm',        name: 'BVM Engineering College',                                 city: 'Surat' },
  { id: 'utu',        name: 'Uka Tarsadia University',                                 city: 'Surat' },
  { id: 'siu',        name: 'Sardar Patel University (Surat)',                         city: 'Surat' },
  { id: 'sgvu_s',     name: 'SGVU – Surat Campus',                                    city: 'Surat' },
  { id: 'vnsgu',      name: 'Veer Narmad South Gujarat University',                   city: 'Surat' },
  { id: 'ppsu',       name: 'P P Savani University',                                  city: 'Surat' },
  { id: 'siet_s',     name: 'SIET – Surat Institute of Engineering & Technology',     city: 'Surat' },

  // Vadodara (Baroda)
  { id: 'msu',        name: 'The Maharaja Sayajirao University of Baroda',            city: 'Vadodara' },
  { id: 'bvm_v',      name: 'BVM Engineering College (Vallabh Vidyanagar)',           city: 'Vadodara' },
  { id: 'parul',      name: 'Parul University',                                       city: 'Vadodara' },
  { id: 'gtu_v',      name: 'GTU – Government Engineering College Vadodara',          city: 'Vadodara' },
  { id: 'msv',        name: 'MSU Faculty of Engineering',                              city: 'Vadodara' },
  { id: 'pdpu',       name: 'PDEU – Pandit Deendayal Energy University',              city: 'Vadodara' },

  // Rajkot
  { id: 'marwadi_r',  name: 'Marwadi University',                                     city: 'Rajkot' },
  { id: 'rk_univ',   name: 'RK University',                                           city: 'Rajkot' },
  { id: 'kr_shah',   name: 'K.R. Shah Degree Engineering College',                   city: 'Rajkot' },
  { id: 'gtu_r',     name: 'GTU – Government Engineering College Rajkot',            city: 'Rajkot' },
  { id: 'sgvu_r',    name: 'Saurashtra University (Rajkot)',                          city: 'Rajkot' },

  // Gandhinagar
  { id: 'pdpu_gn',   name: 'PDEU – Pandit Deendayal Energy University',              city: 'Gandhinagar' },
  { id: 'da_iict',   name: 'DA-IICT – Dhirubhai Ambani Institute',                   city: 'Gandhinagar' },
  { id: 'iit_gn',    name: 'IIT Gandhinagar',                                        city: 'Gandhinagar' },
  { id: 'gtu_main',  name: 'Gujarat Technological University (GTU)',                  city: 'Gandhinagar' },
  { id: 'gift_gn',   name: 'GIFT City College',                                       city: 'Gandhinagar' },

  // Anand / Vallabh Vidyanagar
  { id: 'bvm_a',     name: 'BVM Engineering College (Vallabh Vidyanagar)',            city: 'Anand' },
  { id: 'adit_a',    name: 'ADIT – A.D. Patel Institute of Technology',              city: 'Anand' },
  { id: 'spce',      name: 'Sardar Patel College of Engineering',                    city: 'Anand' },

  // Bhavnagar
  { id: 'bau',        name: 'Bhavnagar University',                                   city: 'Bhavnagar' },
  { id: 'gtu_b',     name: 'GTU – Government Engineering College Bhavnagar',         city: 'Bhavnagar' },

  // Jamnagar / Morbi / Other
  { id: 'gtu_j',     name: 'Government Engineering College Jamnagar',                city: 'Jamnagar' },
  { id: 'morbi',     name: 'Government Engineering College Morbi',                   city: 'Morbi' },
  { id: 'palanpur',  name: 'Government Engineering College Palanpur',                city: 'Palanpur' },
  { id: 'modasa',    name: 'Government Engineering College Modasa',                  city: 'Modasa' },
  { id: 'hirak',     name: 'Hirak University',                                        city: 'Hirak' },

  // Other notable
  { id: 'other',     name: 'Other (not listed)',                                      city: '' },
]

/** Pre-built branches for every static college (same set for all). */
export const gujaratBranches: StaticBranch[] = gujaratColleges.flatMap((college) =>
  COMMON_BRANCHES.map((b) => ({
    id: `${college.id}_${b.id}`,
    name: b.name,
    college_id: college.id,
  }))
)

/** Static semesters 1–8 */
export const staticSemesters = Array.from({ length: 8 }, (_, i) => ({
  id: `sem_${i + 1}`,
  label: `Semester ${i + 1}`,
  number: i + 1,
}))

