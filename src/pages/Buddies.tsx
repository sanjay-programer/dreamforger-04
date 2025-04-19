import { Starscape } from "@/components/Starscape";
import { Sidebar } from "@/components/Sidebar";
import { Search, Filter, UserPlus, MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface BuddyCardProps {
  name: string;
  dream: string;
  skills: string[];
  connectionPercentage: number;
  avatarUrl?: string;
  status: 'online' | 'offline';
}

const BuddyCard = ({
  name,
  dream,
  skills,
  connectionPercentage,
  avatarUrl,
  status
}: BuddyCardProps) => {
  return (
    <div className="glassmorphism rounded-lg p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
      <div className="flex justify-between">
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-xl font-bold">
              {!avatarUrl ? name.charAt(0) : (
                <img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover" />
              )}
            </div>
            <div className={cn(
              "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-cosmic-black",
              status === 'online' ? "bg-neon-green" : "bg-gray-400"
            )} />
          </div>
          
          {/* Info */}
          <div>
            <h3 className="font-bold">{name}</h3>
            <p className="text-sm text-gray-300">{dream}</p>
          </div>
        </div>
        
        {/* Match percentage circle */}
        <div className="relative h-12 w-12">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke={connectionPercentage > 80 ? "#39FF14" : connectionPercentage > 60 ? "#18FFFF" : "#FF00FF"}
              strokeWidth="3"
              strokeDasharray={`${connectionPercentage}, 100`}
              strokeDashoffset="25"
              strokeLinecap="round"
            />
            <text
              x="18"
              y="18"
              dominantBaseline="central"
              textAnchor="middle"
              fontSize="10"
              fill="white"
              fontWeight="bold"
            >
              {connectionPercentage}%
            </text>
          </svg>
        </div>
      </div>
      
      {/* Skills */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span 
              key={index} 
              className="text-xs py-1 px-2 rounded-full bg-white/10"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      {/* Connect button - visible on hover */}
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="flex items-center justify-center space-x-2 w-full py-2 rounded-lg bg-neon-cyan/20 hover:bg-neon-cyan/30 transition-all duration-200 border border-neon-cyan">
          <UserPlus className="w-4 h-4" />
          <span className="text-sm font-medium">Connect</span>
        </button>
      </div>
    </div>
  );
};

const Buddies = () => {
  // Sample buddy data
  const buddies = [
    {
      id: 1,
      name: "Alex Kim",
      dream: "Developer",
      skills: ["JavaScript", "React", "UI Design"],
      connectionPercentage: 89,
      status: "online" as const
    },
    {
      id: 2,
      name: "Jordan Taylor",
      dream: "Data Scientist",
      skills: ["Python", "Machine Learning", "Statistics"],
      connectionPercentage: 76,
      status: "offline" as const
    },
    {
      id: 3,
      name: "Morgan Riley",
      dream: "UX Designer",
      skills: ["Figma", "UI/UX", "User Research"],
      connectionPercentage: 92,
      status: "online" as const
    },
    {
      id: 4,
      name: "Casey Johnson",
      dream: "Developer",
      skills: ["TypeScript", "Node.js", "AWS"],
      connectionPercentage: 65,
      status: "online" as const
    },
    {
      id: 5,
      name: "Taylor Smith",
      dream: "AI Researcher",
      skills: ["Deep Learning", "Computer Vision", "Python"],
      connectionPercentage: 73,
      status: "offline" as const
    },
    {
      id: 6,
      name: "Jamie Doe",
      dream: "Game Developer",
      skills: ["Unity", "C#", "3D Modeling"],
      connectionPercentage: 82,
      status: "offline" as const
    },
    {
      id: 7,
      name: "Riley Cooper",
      dream: "Blockchain Dev",
      skills: ["Solidity", "Web3", "Smart Contracts"],
      connectionPercentage: 58,
      status: "online" as const
    },
    {
      id: 8,
      name: "Avery Martinez",
      dream: "DevOps Engineer",
      skills: ["Docker", "Kubernetes", "CI/CD"],
      connectionPercentage: 69,
      status: "online" as const
    }
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 pl-[240px] p-8">
        <header className="mb-8">
          <h1 className="text-5xl font-bold neon-text-cyan mb-4">Find Dream Buddies</h1>
          <p className="text-2xl text-gray-400">Connect with others on similar learning journeys</p>
        </header>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-6 mb-8">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Search by name, skill, or dream..."
              className="w-full pl-12 pr-4 py-3 text-xl rounded-lg glassmorphism bg-white/5 border border-white/20 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan"
            />
          </div>

          <button className="flex items-center space-x-3 py-3 px-6 text-xl rounded-lg glassmorphism border border-white/20 hover:border-white/40">
            <Filter className="w-6 h-6" />
            <span>Filters</span>
          </button>

          <div className="flex space-x-4">
            <button className="py-3 px-6 text-xl rounded-lg bg-neon-cyan/20 border border-neon-cyan hover:neon-glow-cyan">All</button>
            <button className="py-3 px-6 text-xl rounded-lg bg-white/5 border border-white/20 hover:border-white/40">Online</button>
            <button className="py-3 px-6 text-xl rounded-lg bg-white/5 border border-white/20 hover:border-white/40">Same Dream</button>
          </div>
        </div>

        {/* Buddy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {buddies.map(buddy => (
            <BuddyCard
              key={buddy.id}
              name={buddy.name}
              dream={buddy.dream}
              skills={buddy.skills}
              connectionPercentage={buddy.connectionPercentage}
              status={buddy.status}
            />
          ))}
        </div>

        {/* Suggested Connections */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6 neon-text-magenta">Recommended Connections</h2>
          <div className="glassmorphism-dark rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-magenta to-neon-cyan flex items-center justify-center text-2xl font-bold">
                  S
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Sam Anderson</h3>
                  <p className="text-xl text-gray-300">Mentor • 5+ years experience</p>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button className="p-3 rounded-full bg-white/10 hover:bg-white/20">
                  <Star className="w-6 h-6 text-yellow-400" />
                </button>
                <button className="p-3 rounded-full bg-white/10 hover:bg-white/20">
                  <MessageSquare className="w-6 h-6" />
                </button>
                <button className="py-2 px-6 text-xl rounded-lg bg-neon-cyan/20 border border-neon-cyan hover:neon-glow-cyan">
                  <span className="font-medium">Connect</span>
                </button>
              </div>
            </div>
            
            <p className="text-xl text-gray-300 mb-6">
              Sam specializes in your dream field and has mentored 12 successful learners. Based on your profile, you're a 97% match!
            </p>
            
            <div className="flex flex-wrap gap-3">
              <span className="text-lg py-2 px-4 rounded-full bg-white/10">JavaScript</span>
              <span className="text-lg py-2 px-4 rounded-full bg-white/10">React</span>
              <span className="text-lg py-2 px-4 rounded-full bg-white/10">Node.js</span>
              <span className="text-lg py-2 px-4 rounded-full bg-white/10">Career Guidance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buddies;
