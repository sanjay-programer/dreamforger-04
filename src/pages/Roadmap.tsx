import { Starscape } from "@/components/Starscape";
import { Sidebar } from "@/components/Sidebar";
import { Upload, Check, Clock, Plus, FileImage, FileAudio, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoadmapNodeProps {
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  isLast?: boolean;
}

const RoadmapNode = ({ title, description, status, isLast = false }: RoadmapNodeProps) => {
  const statusColors = {
    completed: 'bg-neon-green text-black',
    'in-progress': 'bg-neon-cyan text-black',
    pending: 'bg-white/20'
  };

  const statusIcons = {
    completed: <Check className="w-5 h-5" />,
    'in-progress': <Clock className="w-5 h-5" />,
    pending: <Clock className="w-5 h-5 opacity-50" />
  };

  return (
    <div className="flex">
      {/* Status indicator column */}
      <div className="flex flex-col items-center mr-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center",
          statusColors[status]
        )}>
          {statusIcons[status]}
        </div>
        {!isLast && (
          <div className={cn(
            "w-1 flex-grow my-2",
            status === 'completed' ? 'bg-neon-green' : 'bg-white/20'
          )}></div>
        )}
      </div>

      {/* Content column */}
      <div className={cn(
        "glassmorphism rounded-lg p-5 mb-6 w-full",
        status === 'completed' ? 'neon-border-green' : 
        status === 'in-progress' ? 'neon-border-cyan' : 'border-white/10'
      )}>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm opacity-80 mb-4">{description}</p>

        {status === 'completed' && (
          <div className="bg-white/10 p-3 rounded-lg flex items-center">
            <FileImage className="w-5 h-5 mr-2 text-neon-green" />
            <span className="text-sm">Proof uploaded</span>
          </div>
        )}

        {status === 'in-progress' && (
          <button 
            className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 
                     w-full p-3 rounded-lg transition-all duration-300"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Proof</span>
          </button>
        )}
      </div>
    </div>
  );
};

const Roadmap = () => {
  // Sample roadmap data
  const roadmapNodes = [
    {
      id: 1,
      title: "Foundation Building",
      description: "Complete the introductory coursework and setup your learning environment.",
      status: "completed" as const
    },
    {
      id: 2,
      title: "Core Principles",
      description: "Master the fundamental concepts and frameworks essential to your field.",
      status: "completed" as const
    },
    {
      id: 3,
      title: "Applied Practice",
      description: "Apply your knowledge through hands-on projects and practical exercises.",
      status: "in-progress" as const
    },
    {
      id: 4,
      title: "Advanced Techniques",
      description: "Explore cutting-edge methods and specialized tools in your domain.",
      status: "pending" as const
    },
    {
      id: 5,
      title: "Real-world Application",
      description: "Demonstrate mastery through a capstone project addressing real challenges.",
      status: "pending" as const
    }
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 pl-[240px] p-8">
        <header className="mb-8">
          <h1 className="text-5xl font-bold neon-text-cyan mb-4">Your Learning Roadmap</h1>
          <p className="text-2xl text-gray-400">Track your progress on the path to mastery</p>
        </header>

        {/* Roadmap container */}
        <div className="glassmorphism-dark rounded-xl p-8 max-w-4xl">
          {/* Roadmap nodes */}
          <div className="mb-10">
            {roadmapNodes.map((node, index) => (
              <RoadmapNode 
                key={node.id}
                title={node.title}
                description={node.description}
                status={node.status}
                isLast={index === roadmapNodes.length - 1}
              />
            ))}
          </div>

          {/* Generate New Task button */}
          <button className={cn(
            "flex items-center justify-center space-x-2 py-4 px-8 rounded-lg",
            "bg-neon-cyan/20 hover:bg-neon-cyan/30 transition-all duration-300",
            "border border-neon-cyan hover:neon-glow-cyan",
            "fixed bottom-8 right-8"
          )}>
            <Plus className="w-6 h-6" />
            <span className="text-xl font-medium">Generate New Task</span>
          </button>
        </div>

        {/* Proof upload panel */}
        <div className="glassmorphism-dark mt-8 rounded-xl p-8 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Upload Proof</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center p-6 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
              <FileImage className="w-12 h-12 mb-4 text-neon-cyan" />
              <span className="text-xl">Image</span>
            </div>
            <div className="flex flex-col items-center p-6 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
              <FileAudio className="w-12 h-12 mb-4 text-neon-magenta" />
              <span className="text-xl">Audio</span>
            </div>
            <div className="flex flex-col items-center p-6 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-all">
              <FileText className="w-12 h-12 mb-4 text-neon-green" />
              <span className="text-xl">Text</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
