import { SITE_URL } from './site';

export type Download = { id: string; title: string; subtitle: string; url: string; kind: 'pdf' | 'page' };

export const downloads: Download[] = [
  { id: 'action-verbs', title: 'Action verbs for resume', subtitle: 'Сильні дієслова для резюме', url: `${SITE_URL}/assets/downloads/action_verbs_for_resume.pdf`, kind: 'pdf' },
  { id: 'resume-template', title: 'Resume layout template', subtitle: 'Шаблон структури резюме', url: `${SITE_URL}/assets/downloads/resume_layout_template_1.pdf`, kind: 'pdf' },
  { id: 'strong-words', title: 'Strong words', subtitle: 'Замість «very»', url: `${SITE_URL}/assets/downloads/strong_words_instead_of_very.pdf`, kind: 'pdf' },
  { id: 'interview-cheat-sheet', title: 'Interview cheat sheet', subtitle: 'Шпаргалка до співбесіди', url: `${SITE_URL}/assets/downloads/interview_cheat_sheet.pdf`, kind: 'pdf' },
  { id: 'status-updates', title: 'Guide to fine-tune your status updates', subtitle: 'Гайд по статус-апдейтах', url: `${SITE_URL}/downloads/details/guide_to_fine-tune_your_status_updates`, kind: 'page' },
];

export type CaseStudy = { id: string; title: string; subtitle: string; url: string };

export const caseStudies: CaseStudy[] = [
  { id: 'thanks-a-lot', title: 'Thanks-A-Lot Email', subtitle: 'Як дякувати так, щоб це читали', url: `${SITE_URL}/case-study/thanks-a-lot_email` },
  { id: 'status-meeting', title: 'Email Instead of a Status Update Meeting', subtitle: 'Коли імейл замінює зустріч', url: `${SITE_URL}/case-study/email_instead_of_a_status_update_meeting` },
];
