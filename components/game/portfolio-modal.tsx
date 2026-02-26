"use client";

import { useEffect, useCallback } from "react";
import { portfolioData } from "@/lib/portfolio-data";
import { X, Github, Linkedin, Mail, ExternalLink, GraduationCap, Briefcase, Code, User, Send } from "lucide-react";

interface PortfolioModalProps {
  section: string | null;
  onClose: () => void;
}

export default function PortfolioModal({
  section,
  onClose,
}: PortfolioModalProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  if (!section) return null;

  const sectionConfig: Record<string, { title: string; icon: React.ReactNode; borderColor: string }> = {
    about: { title: "PROF. OAK'S LAB", icon: <User size={18} />, borderColor: "border-primary" },
    projects: { title: "POKE GYM", icon: <Code size={18} />, borderColor: "border-accent" },
    experience: { title: "POKE CENTER", icon: <Briefcase size={18} />, borderColor: "border-primary" },
    education: { title: "TRAINER SCHOOL", icon: <GraduationCap size={18} />, borderColor: "border-chart-4" },
    contact: { title: "POST OFFICE", icon: <Send size={18} />, borderColor: "border-secondary" },
  };

  const config = sectionConfig[section];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={config?.title || section}
    >
      <div
        className={`relative w-[90vw] max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-2 ${config?.borderColor || "border-border"} p-0 animate-in zoom-in-95 duration-200`}
        style={{ imageRendering: "auto" }}
      >
        {/* Header bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-card border-b-2 border-border px-4 py-3">
          <div className="flex items-center gap-2 text-accent text-[10px]">
            {config?.icon}
            <span>{config?.title}</span>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {section === "about" && <AboutSection />}
          {section === "projects" && <ProjectsSection />}
          {section === "experience" && <ExperienceSection />}
          {section === "education" && <EducationSection />}
          {section === "contact" && <ContactSection />}
        </div>

        {/* Footer */}
        <div className="border-t-2 border-border px-4 py-2 flex justify-end">
          <button
            onClick={onClose}
            className="text-[9px] text-muted-foreground hover:text-accent transition-colors"
          >
            {"[ESC] Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ABOUT ---
function AboutSection() {
  const { about } = portfolioData;
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="w-20 h-20 border-2 border-primary overflow-hidden flex-shrink-0" style={{ imageRendering: "auto" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={about.avatar}
            alt={about.name}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
        <div>
          <h2 className="text-[13px] text-foreground leading-relaxed">{about.name}</h2>
          <p className="text-[9px] text-accent mt-1 leading-relaxed">{about.title}</p>
          <div className="mt-1 inline-block bg-secondary text-secondary-foreground text-[8px] px-2 py-0.5">
            {"#OpenToWork"}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[9px] text-muted-foreground leading-relaxed">
          {about.bio}
        </p>
        <p className="text-[9px] text-muted-foreground leading-relaxed">
          {about.bio2}
        </p>
      </div>

      <div>
        <h3 className="text-[10px] text-accent mb-2">{"SKILLS"}</h3>
        <div className="flex flex-wrap gap-1.5">
          {about.skills.map((skill) => (
            <span
              key={skill}
              className="text-[8px] bg-muted text-muted-foreground px-2 py-1 border border-border"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- PROJECTS ---
function ProjectsSection() {
  const { projects } = portfolioData;
  return (
    <div className="space-y-4">
      <p className="text-[9px] text-muted-foreground leading-relaxed">
        {"Welcome to the GYM! Here are the projects I've built:"}
      </p>
      {projects.map((project, i) => (
        <div
          key={project.name}
          className={`border border-border p-3 space-y-2 ${project.featured ? "border-l-2 border-l-accent" : ""}`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[10px] text-foreground leading-relaxed">
                {project.featured && (
                  <span className="text-accent mr-1">{"*"}</span>
                )}
                {project.name}
              </h3>
              <p className="text-[8px] text-muted-foreground mt-1 leading-relaxed">
                {project.description}
              </p>
            </div>
            <span className="text-[8px] text-muted-foreground whitespace-nowrap">
              {`#${String(i + 1).padStart(2, "0")}`}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[7px] bg-muted text-muted-foreground px-1.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[8px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github size={12} /> {"Source"}
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[8px] text-accent hover:text-foreground transition-colors"
              >
                <ExternalLink size={12} /> {"Live"}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- EXPERIENCE ---
function ExperienceSection() {
  const { experience } = portfolioData;
  return (
    <div className="space-y-4">
      <p className="text-[9px] text-muted-foreground leading-relaxed">
        {"Welcome to the POKE CENTER! Here is my journey so far:"}
      </p>
      {experience.map((exp) => (
        <div key={exp.role} className="border-l-2 border-primary pl-3 space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h3 className="text-[10px] text-foreground leading-relaxed">{exp.role}</h3>
            <span className="text-[7px] text-accent">{exp.period}</span>
          </div>
          <p className="text-[8px] text-accent leading-relaxed">{exp.company}</p>
          <p className="text-[8px] text-muted-foreground leading-relaxed">
            {exp.description}
          </p>
        </div>
      ))}
    </div>
  );
}

// --- EDUCATION ---
function EducationSection() {
  const { education } = portfolioData;
  return (
    <div className="space-y-4">
      <p className="text-[9px] text-muted-foreground leading-relaxed">
        {"Welcome to TRAINER SCHOOL! Here is my education path:"}
      </p>
      {education.map((edu) => (
        <div
          key={edu.degree}
          className="border border-border p-3 space-y-2"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h3 className="text-[10px] text-foreground leading-relaxed">{edu.degree}</h3>
            <span className="text-[7px] text-muted-foreground">{edu.period}</span>
          </div>
          <p className="text-[9px] text-chart-4 leading-relaxed">{edu.school}</p>
          <ul className="space-y-1">
            {edu.details.map((d, i) => (
              <li key={i} className="text-[8px] text-muted-foreground leading-relaxed flex gap-1.5">
                <span className="text-chart-4">{">"}</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// --- CONTACT ---
function ContactSection() {
  const { contact } = portfolioData;
  return (
    <div className="space-y-4">
      <p className="text-[9px] text-muted-foreground leading-relaxed">
        {"Welcome to the POST OFFICE! Let's get in touch:"}
      </p>
      <div className="space-y-3">
        <a
          href={`mailto:${contact.email}`}
          className="flex items-center gap-3 border border-border p-3 hover:border-secondary transition-colors group"
        >
          <Mail size={16} className="text-secondary" />
          <div>
            <p className="text-[9px] text-foreground group-hover:text-secondary transition-colors leading-relaxed">{"Email"}</p>
            <p className="text-[8px] text-muted-foreground leading-relaxed">{contact.email}</p>
          </div>
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border border-border p-3 hover:border-chart-4 transition-colors group"
        >
          <Linkedin size={16} className="text-chart-4" />
          <div>
            <p className="text-[9px] text-foreground group-hover:text-chart-4 transition-colors leading-relaxed">{"LinkedIn"}</p>
            <p className="text-[8px] text-muted-foreground leading-relaxed">{"Ayush Lahiri"}</p>
          </div>
        </a>
        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border border-border p-3 hover:border-foreground transition-colors group"
        >
          <Github size={16} className="text-foreground" />
          <div>
            <p className="text-[9px] text-foreground leading-relaxed">{"GitHub"}</p>
            <p className="text-[8px] text-muted-foreground leading-relaxed">{"ayushL2007"}</p>
          </div>
        </a>
      </div>
    </div>
  );
}
