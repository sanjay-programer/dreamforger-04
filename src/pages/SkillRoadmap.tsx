import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Starscape } from "@/components/Starscape";
import { Sidebar } from "@/components/Sidebar";
import { ArrowLeft, Check, Lock, ChevronDown, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface Stage {
  stage: string;
  description: string;
  completed?: boolean;
  locked?: boolean;
  tasks?: Task[];
}

interface Task {
  task: string;
  description: string;
  proof: string;
  completed?: boolean;
}

const SkillRoadmap = () => {
  const { skillName } = useParams();
  const [stages, setStages] = useState<Stage[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [expandedStage, setExpandedStage] = useState<number | null>(0);
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
            locked: index > currentStage,
            tasks: [] // We'll fetch tasks for each stage
          }));
          setStages(initializedStages);
          
          // Fetch tasks for the first stage
          if (initializedStages.length > 0) {
            fetchTasksForStage(0, initializedStages[0]);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching roadmap",
          variant: "destructive",
        });
      }
    };

    const fetchTasksForStage = async (stageIndex: number, stage: Stage) => {
      try {
        const response = await fetch('http://127.0.0.1:8000/generate-tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            skill: skillName,
            stage: stage.stage,
            description: stage.description
          }),
        });

        const data = await response.json();
        if (data.response && data.response.tasks) {
          setStages(prev => {
            const updated = [...prev];
            updated[stageIndex] = {
              ...updated[stageIndex],
              tasks: data.response.tasks.map((task: Task) => ({ ...task, completed: false }))
            };
            return updated;
          });
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchRoadmap();
  }, [skillName, currentStage, toast]);

  const handleStageClick = (stageIndex: number) => {
    if (stages[stageIndex].locked) {
      toast({
        title: "Stage Locked",
        description: "Complete the previous stages to unlock this one",
        variant: "destructive",
      });
      return;
    }
    setExpandedStage(expandedStage === stageIndex ? null : stageIndex);
  };

  const handleTaskComplete = (stageIndex: number, taskIndex: number) => {
    setStages(prev => {
      const updated = [...prev];
      updated[stageIndex].tasks![taskIndex].completed = true;
      
      // Check if all tasks in the stage are completed
      const allTasksCompleted = updated[stageIndex].tasks?.every(task => task.completed);
      if (allTasksCompleted) {
        updated[stageIndex].completed = true;
        if (stageIndex < updated.length - 1) {
          updated[stageIndex + 1].locked = false;
        }
        setCurrentStage(stageIndex + 1);
      }
      
      return updated;
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

        <div className="space-y-8">
          {stages.map((stage, stageIndex) => (
            <div key={stageIndex} className="relative">
              {/* Stage Card */}
              <div
                className={cn(
                  "glassmorphism p-6 rounded-lg transition-all duration-300",
                  stage.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-neon-cyan",
                  stage.completed && "border-neon-green",
                  expandedStage === stageIndex && "border-neon-cyan"
                )}
                onClick={() => handleStageClick(stageIndex)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                      {stage.completed ? (
                        <Check className="w-6 h-6 text-neon-green" />
                      ) : stage.locked ? (
                        <Lock className="w-6 h-6 text-gray-500" />
                      ) : (
                        <span className="text-2xl font-bold">{stageIndex + 1}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{stage.stage}</h3>
                      <p className="text-gray-300">{stage.description}</p>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "w-6 h-6 transition-transform duration-300",
                    expandedStage === stageIndex && "transform rotate-180"
                  )} />
                </div>
              </div>

              {/* Tasks Section */}
              {expandedStage === stageIndex && stage.tasks && (
                <div className="mt-4 ml-12 pl-6 border-l-2 border-neon-cyan/30 space-y-4">
                  {stage.tasks.map((task, taskIndex) => (
                    <div
                      key={taskIndex}
                      className={cn(
                        "glassmorphism p-4 rounded-lg",
                        task.completed ? "border-neon-green" : "border-neon-cyan/20"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold">{task.task}</h4>
                        {task.completed && <Check className="w-5 h-5 text-neon-green" />}
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{task.description}</p>
                      <div className="bg-white/5 p-3 rounded-lg mb-3">
                        <p className="text-sm text-gray-300">Proof Required: {task.proof}</p>
                      </div>
                      {!task.completed && (
                        <div className="flex items-center space-x-4">
                          <label className="flex-1">
                            <div className="flex items-center justify-center space-x-2 p-2 border border-dashed border-neon-cyan rounded-lg cursor-pointer hover:bg-neon-cyan/10 transition-all duration-300">
                              <span>Upload Proof</span>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  // Simulate file upload
                                  setTimeout(() => {
                                    handleTaskComplete(stageIndex, taskIndex);
                                    toast({
                                      title: "Task Completed!",
                                      description: "Great job! You've completed this task.",
                                      variant: "default",
                                    });
                                  }, 1000);
                                }
                              }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Connection Line */}
              {stageIndex < stages.length - 1 && (
                <div className="absolute left-6 top-[calc(100%+1rem)] w-0.5 h-8 bg-neon-cyan/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillRoadmap; 