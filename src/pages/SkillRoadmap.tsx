import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Starscape } from "@/components/Starscape";
import { Sidebar } from "@/components/Sidebar";
import { ArrowLeft, Check, ChevronRight, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface Stage {
  stage: string;
  description: string;
  completed?: boolean;
  locked?: boolean;
}

const SkillRoadmap = () => {
  const { skillName } = useParams();
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
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
          // Initialize stages with completion status
          const initializedStages = data[skillName!].map((stage: Stage, index: number) => ({
            ...stage,
            completed: index < currentStage,
            locked: index > currentStage
          }));
          setStages(initializedStages);
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
  }, [skillName, currentStage, toast]);

  const handleStageClick = (stage: Stage, index: number) => {
    if (stage.locked) {
      toast({
        title: "Stage Locked",
        description: "Complete the previous stages to unlock this one",
        variant: "destructive",
      });
      return;
    }
    navigate(`/skill-tasks/${encodeURIComponent(skillName!)}/${encodeURIComponent(stage.stage)}`, {
      state: { 
        description: stage.description,
        stageIndex: index,
        onComplete: () => {
          setCurrentStage(index + 1);
          toast({
            title: "Stage Completed!",
            description: "You've unlocked the next stage",
            variant: "default",
          });
        }
      }
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
              className={cn(
                "glassmorphism p-6 rounded-lg transition-all duration-300",
                stage.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-neon-cyan",
                stage.completed && "border-neon-green"
              )}
              onClick={() => handleStageClick(stage, index)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-2xl font-bold">{stage.stage}</h3>
                    {stage.completed && (
                      <Check className="w-6 h-6 text-neon-green" />
                    )}
                    {stage.locked && (
                      <Lock className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <p className="text-gray-300 mt-2">{stage.description}</p>
                </div>
                {!stage.locked && <ChevronRight className="w-6 h-6" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillRoadmap; 