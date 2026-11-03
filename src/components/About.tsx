import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Camera, Trash2, UserRound } from 'lucide-react';

const PHOTO_KEY = 'portfolio-photo';

const skills = [
  'HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'Node.js',
  'Python', 'Git', 'Responsive Design', 'Problem Solving', 'Team Work'
];

export const About = () => {
  const [photo, setPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PHOTO_KEY);
    } catch {
      return null;
    }
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setPhoto(dataUrl);
      try {
        localStorage.setItem(PHOTO_KEY, dataUrl);
      } catch {
        // Storage full — keep showing the photo for this visit
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    try {
      localStorage.removeItem(PHOTO_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">About Me</h2>
          <p className="text-xl text-muted-foreground">
            Student developer passionate about creating digital solutions and learning new technologies.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 card-shadow">
              <div className="flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="relative group w-40 h-40 rounded-full overflow-hidden border-2 border-border bg-muted hover:border-primary transition-colors"
                  aria-label={photo ? 'Change photo' : 'Add your photo'}
                >
                  {photo ? (
                    <img src={photo} alt="My photograph" className="w-full h-full object-cover" />
                  ) : (
                    <span className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <UserRound className="w-14 h-14" />
                      <span className="text-xs flex items-center gap-1">
                        <Camera className="w-3 h-3" /> Add your photo
                      </span>
                    </span>
                  )}
                  <span className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-primary-foreground text-xs font-medium">
                    {photo ? 'Change' : 'Upload'}
                  </span>
                </button>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    handleFile(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />

                {photo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removePhoto}
                    className="mt-2 text-muted-foreground"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Remove photo
                  </Button>
                )}

                <h3 className="text-2xl font-semibold mt-4 mb-1">Vansh S</h3>
                <p className="text-sm text-muted-foreground">Computer Science Student</p>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 card-shadow">
              <h3 className="text-2xl font-semibold mb-4">My Story</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                I'm currently studying Computer Science and have developed a passion for web development
                and creating user-friendly applications. I enjoy turning complex problems into simple,
                beautiful solutions.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Always eager to learn new technologies and collaborate on interesting projects.
                I believe in writing clean, maintainable code and creating meaningful user experiences.
              </p>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Card className="p-6 card-shadow">
            <h3 className="text-2xl font-semibold mb-4">Skills</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm text-center"
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
