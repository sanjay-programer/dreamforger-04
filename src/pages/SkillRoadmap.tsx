import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Starscape } from "@/components/Starscape";
import { Sidebar } from "@/components/Sidebar";
import { ArrowLeft, Check, Lock, ChevronDown, Sparkles, Zap, Target } from 'lucide-react';
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
            <div key={stageIndex} className="relative group">
              {/* Stage Card */}
              <div
                className={cn(
                  "glassmorphism p-6 rounded-lg transition-all duration-300 relative overflow-hidden",
                  stage.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-neon-cyan",
                  stage.completed ? "border-neon-green" : "border-neon-cyan/20",
                  expandedStage === stageIndex && "border-neon-cyan scale-105",
                  !stage.completed && !stage.locked && "hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                )}
                onClick={() => handleStageClick(stageIndex)}
              >
                {/* Background Animation */}
                {!stage.completed && !stage.locked && (
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-neon-magenta/5 animate-pulse" />
                )}
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300",
                      stage.completed ? "bg-neon-green/20" : 
                      stage.locked ? "bg-gray-500/20" : 
                      "bg-gradient-to-br from-neon-cyan/30 to-neon-magenta/30 group-hover:from-neon-cyan/40 group-hover:to-neon-magenta/40"
                    )}>
                      {stage.completed ? (
                        <Check className="w-7 h-7 text-neon-green" />
                      ) : stage.locked ? (
                        <Lock className="w-7 h-7 text-gray-500" />
                      ) : (
                        <div className="relative">
                          <span className="text-2xl font-bold">{stageIndex + 1}</span>
                          <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-neon-cyan animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-2xl font-bold transition-all duration-300",
                        stage.completed ? "text-neon-green" : 
                        stage.locked ? "text-gray-500" : 
                        "text-white group-hover:text-neon-cyan"
                      )}>{stage.stage}</h3>
                      <p className={cn(
                        "text-gray-300 transition-all duration-300",
                        !stage.locked && "group-hover:text-neon-cyan/80"
                      )}>{stage.description}</p>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "w-6 h-6 transition-all duration-300",
                    expandedStage === stageIndex ? "transform rotate-180 text-neon-cyan" : 
                    stage.locked ? "text-gray-500" : 
                    "text-neon-cyan/50 group-hover:text-neon-cyan"
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
                        "glassmorphism p-4 rounded-lg relative overflow-hidden transition-all duration-300",
                        task.completed ? "border-neon-green" : "border-neon-cyan/20 hover:border-neon-cyan",
                        !task.completed && "hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]"
                      )}
                    >
                      {!task.completed && (
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-neon-magenta/5 animate-pulse" />
                      )}
                      <div className="relative flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            task.completed ? "bg-neon-green/20" : "bg-neon-cyan/20"
                          )}>
                            {task.completed ? (
                              <Check className="w-4 h-4 text-neon-green" />
                            ) : (
                              <Target className="w-4 h-4 text-neon-cyan" />
                            )}
                          </div>
                          <h4 className={cn(
                            "text-lg font-semibold",
                            task.completed ? "text-neon-green" : "text-white"
                          )}>{task.task}</h4>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{task.description}</p>
                      <div className="bg-white/5 p-3 rounded-lg mb-3">
                        <p className="text-sm text-gray-300">Proof Required: {task.proof}</p>
                      </div>
                      {!task.completed && (
                        <div className="flex items-center space-x-4">
                          <label className="flex-1">
                            <div className="flex items-center justify-center space-x-2 p-2 border border-dashed border-neon-cyan rounded-lg cursor-pointer hover:bg-neon-cyan/10 transition-all duration-300 group">
                              <Zap className="w-4 h-4 text-neon-cyan group-hover:animate-pulse" />
                              <span className="text-neon-cyan group-hover:text-white">Upload Proof</span>
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
                <div className="absolute left-6 top-[calc(100%+1rem)] w-0.5 h-8 bg-gradient-to-b from-neon-cyan/30 to-neon-magenta/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillRoadmap; 