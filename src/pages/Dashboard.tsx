import { useEffect, useState } from 'react';
import { Starscape } from "@/components/Starscape";
import { Sidebar } from "@/components/Sidebar";
import { BarChart, Activity, Award, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface Skill {
  id: number;
  name: string;
  description: string;
  power: string;
}

interface UserDetails {
  name: string;
  age: number;
  education: string;
  dream: string | null;
}

const Dashboard = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const { userId } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/user/details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId
          }),
        });

        const data = await response.json();
        if (data.success) {
          setUserDetails(data.data);
          return data.data.dream;
        }
        return null;
      } catch (error) {
        console.error('Error fetching user details:', error);
        return null;
      }
    };

    const fetchSkills = async () => {
      try {
        const dream = await fetchUserDetails();
        if (!dream) {
          toast({
            title: "No Dream Set",
            description: "Please set your dream in the dream selection page",
            variant: "destructive",
          });
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/generate-skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ dream }),
        });

        const data = await response.json();

        if (data.response && data.response.skills) {
          setSkills(data.response.skills);
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch skills",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching skills",
          variant: "destructive",
        });
      }
    };

    fetchSkills();
  }, [userId, toast]);

  const handleActivateSkill = (skill: Skill) => {
    navigate(`/skill-roadmap/${encodeURIComponent(skill.name)}`);
  };

  // Sample data
  const stats = [
    { label: "Learning Streaks", value: "12 days", icon: Activity, color: "neon-cyan" },
    { label: "XP Gained", value: "4,780", icon: BarChart, color: "neon-magenta" },
    { label: "Time Invested", value: "27 hours", icon: BarChart, color: "neon-green" }
  ];

  const achievements = [
    { name: "First Step", description: "Complete your first mission", unlocked: true },
    { name: "Consistency", description: "Maintain a 7-day streak", unlocked: true },
    { name: "Quick Learner", description: "Complete 10 missions", unlocked: true },
    { name: "Expert", description: "Reach Level 10", unlocked: false },
    { name: "Mastery", description: "Complete your dream roadmap", unlocked: false }
  ];

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 pl-[240px] p-8">
        <header className="mb-8">
          <h1 className="text-5xl font-bold neon-text-cyan mb-4">Dashboard</h1>
          <p className="text-2xl text-gray-400">Track your learning progress</p>
          {userDetails?.dream && (
            <p className="text-xl text-neon-magenta mt-2">
              Your Dream: <span className="font-bold">{userDetails.dream}</span>
            </p>
          )}
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="glassmorphism p-6 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-${stat.color}/20`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-xl text-gray-300">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divine Skills Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold neon-text-magenta mb-6">Divine Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="glassmorphism p-6 rounded-lg hover:border-neon-cyan transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">{skill.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-neon-cyan" />
                    <span className="text-neon-cyan text-sm">{skill.power}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleActivateSkill(skill)}
                  className="w-full py-3 bg-gradient-to-r from-neon-cyan/20 to-neon-magenta/20 hover:from-neon-cyan/30 hover:to-neon-magenta/30 border border-neon-cyan rounded-lg transition-all duration-300 group-hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-bold">Activate Skill</span>
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <h2 className="text-4xl font-bold neon-text-purple mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="glassmorphism p-6 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${achievement.unlocked ? 'bg-neon-green/20' : 'bg-white/10'}`}>
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{achievement.name}</h3>
                    <p className="text-xl text-gray-300">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
