import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Github, Globe, Smartphone, ServerCog } from 'lucide-react';

const projects = [
  {
    title: "Web Application",
    description: "A responsive web application built with React and modern web technologies.",
    tech: ["React", "TypeScript", "Tailwind"],
    color: "border-t-4 border-t-primary",
    icon: Globe,
    github: "#",
    live: "#"
  },
  {
    title: "Mobile App Design",
    description: "User interface design for a mobile application with focus on user experience.",
    tech: ["Figma", "UI/UX", "Prototyping"],
    color: "border-t-4 border-t-emerald-500",
    icon: Smartphone,
    github: "#",
    live: "#"
  },
  {
    title: "API Integration",
    description: "Backend integration project demonstrating REST API usage and data handling.",
    tech: ["JavaScript", "API", "JSON"],
    color: "border-t-4 border-t-amber-500",
    icon: ServerCog,
    github: "#",
    live: "#"
  }
];

export const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">My Projects</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A collection of my work showcasing various skills and technologies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const Icon = project.icon;
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className={`p-6 h-full card-shadow hover:shadow-lg transition-all duration-300 ${project.color}`}>
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                    <Button size="sm" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
