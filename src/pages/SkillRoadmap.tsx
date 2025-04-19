import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Starscape } from "@/components/Starscape";
import { Sidebar } from "@/components/Sidebar";
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Stage {
  stage: string;
  description: string;
}

const SkillRoadmap = () => {
  const { skillName } = useParams();
  const [stages, setStages] = useState<Stage[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/generate-skill-mastery-roadmap', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            skill: skillName
          }),
        });

        const data = await response.json();
        if (data[skillName!]) {
          setStages(data[skillName!]);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch roadmap",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching roadmap",
          variant: "destructive",
        });
      }
    };

    fetchRoadmap();
  }, [skillName, toast]);

  const handleStageClick = (stage: Stage) => {
    navigate(`/skill-tasks/${encodeURIComponent(skillName!)}/${encodeURIComponent(stage.stage)}`, {
      state: { description: stage.description }
    });
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 pl-[240px] p-8">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-lg glassmorphism hover:bg-neon-cyan/20 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-5xl font-bold neon-text-cyan">Skill Roadmap</h1>
        </div>

        <div className="space-y-6">
          {stages.map((stage, index) => (
            <div
              key={index}
              className="glassmorphism p-6 rounded-lg cursor-pointer hover:border-neon-cyan transition-all duration-300"
              onClick={() => handleStageClick(stage)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{stage.stage}</h3>
                  <p className="text-gray-300">{stage.description}</p>
                </div>
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillRoadmap; 