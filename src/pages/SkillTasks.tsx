import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Starscape } from "@/components/Starscape";
import { Sidebar } from "@/components/Sidebar";
import { ArrowLeft, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Task {
  task: string;
  description: string;
  proof: string;
}

const SkillTasks = () => {
  const { skillName, stageName } = useParams();
  const { state } = useLocation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/generate-tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            skill: skillName,
            stage: stageName,
            description: state?.description || ''
          }),
        });

        const data = await response.json();
        if (data.response && data.response.tasks) {
          setTasks(data.response.tasks);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch tasks",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching tasks",
          variant: "destructive",
        });
      }
    };

    fetchTasks();
  }, [skillName, stageName, state?.description, toast]);

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
          <h1 className="text-5xl font-bold neon-text-cyan">Stage Tasks</h1>
        </div>

        <div className="space-y-6">
          {tasks.map((task, index) => (
            <div key={index} className="glassmorphism p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">{task.task}</h3>
              <p className="text-gray-300 mb-4">{task.description}</p>
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Proof Required:</h4>
                <p className="text-gray-300">{task.proof}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillTasks; 