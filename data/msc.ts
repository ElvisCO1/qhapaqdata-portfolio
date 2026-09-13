import type { AcademicTerm } from "@/types/msc";

export const academicTerms: AcademicTerm[] = [
  {
    slug: "2026-ii",
    title: "Semester 2",
    period: "2026-II",
    kind: "semester",
    courses: [
      {
        slug: "deep-learning-neural-networks",
        title: "Deep Learning & Neural Networks",
        description:
          "Neural networks, deep learning architectures and temporal modeling.",
        tags: [
          "Neural Networks",
          "Deep Learning",
          "LSTM",
          "GRU",
          "Transformers",
        ],
      },
      {
        slug: "natural-language-processing",
        title: "Natural Language Processing",
        description: "Text processing, language models and applied NLP.",
        tags: [
          "Tokenization",
          "Embeddings",
          "Transformers",
          "Sentiment Analysis",
        ],
      },
      {
        slug: "computer-vision",
        title: "Computer Vision",
        description: "Image processing and computer vision techniques.",
        tags: ["OpenCV", "Image Processing", "CNN", "Feature Extraction"],
      },
      {
        slug: "research-seminar",
        title: "Research Seminar",
        description:
          "Research methodology, Design Science Research and experimental evaluation.",
        tags: [
          "DSRM",
          "Research Design",
          "Experimental Evaluation",
          "Reproducibility",
        ],
      },
    ],
  },
];

export function findAcademicCourse(termSlug: string, courseSlug: string) {
  const term = academicTerms.find((item) => item.slug === termSlug);
  const course = term?.courses.find((item) => item.slug === courseSlug);
  return term && course ? { term, course } : undefined;
}
