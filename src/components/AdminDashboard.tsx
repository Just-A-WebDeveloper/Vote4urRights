
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { LogOut, Plus, Users, BarChart3, Settings, Calendar, User, Image } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  bio: string;
  photo?: string;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  candidates: Candidate[];
  votes: Record<string, string>; // userId -> candidateId
  status: 'upcoming' | 'ongoing' | 'ended';
}

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // New poll form state
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [{ name: '', bio: '', photo: '' }]
  });

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = () => {
    const savedPolls = localStorage.getItem('vote4urRights_polls');
    if (savedPolls) {
      const parsedPolls = JSON.parse(savedPolls);
      // Update poll status based on current date
      const updatedPolls = parsedPolls.map((poll: Poll) => {
        const now = new Date();
        const startDate = new Date(poll.startDate);
        const endDate = new Date(poll.endDate);
        
        if (now < startDate) {
          poll.status = 'upcoming';
        } else if (now > endDate) {
          poll.status = 'ended';
        } else {
          poll.status = 'ongoing';
        }
        
        return poll;
      });
      
      setPolls(updatedPolls);
      localStorage.setItem('vote4urRights_polls', JSON.stringify(updatedPolls));
    }
  };

  const addCandidate = () => {
    setNewPoll(prev => ({
      ...prev,
      candidates: [...prev.candidates, { name: '', bio: '', photo: '' }]
    }));
  };

  const updateCandidate = (index: number, field: string, value: string) => {
    setNewPoll(prev => ({
      ...prev,
      candidates: prev.candidates.map((candidate, i) => 
        i === index ? { ...candidate, [field]: value } : candidate
      )
    }));
  };

  const removeCandidate = (index: number) => {
    if (newPoll.candidates.length > 1) {
      setNewPoll(prev => ({
        ...prev,
        candidates: prev.candidates.filter((_, i) => i !== index)
      }));
    }
  };

  const createPoll = () => {
    if (!newPoll.title || !newPoll.description || !newPoll.startDate || !newPoll.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(newPoll.startDate) >= new Date(newPoll.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    if (newPoll.candidates.some(c => !c.name || !c.bio)) {
      toast.error('All candidates must have a name and bio');
      return;
    }

    const poll: Poll = {
      id: `poll-${Date.now()}`,
      title: newPoll.title,
      description: newPoll.description,
      startDate: newPoll.startDate,
      endDate: newPoll.endDate,
      candidates: newPoll.candidates.map((c, i) => ({
        id: `candidate-${Date.now()}-${i}`,
        name: c.name,
        bio: c.bio,
        photo: c.photo
      })),
      votes: {},
      status: new Date() < new Date(newPoll.startDate) ? 'upcoming' : 'ongoing'
    };

    const updatedPolls = [...polls, poll];
    setPolls(updatedPolls);
    localStorage.setItem('vote4urRights_polls', JSON.stringify(updatedPolls));
    
    // Reset form
    setNewPoll({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      candidates: [{ name: '', bio: '', photo: '' }]
    });
    
    setIsCreating(false);
    toast.success('Poll created successfully!');
  };

  const deletePoll = (pollId: string) => {
    const updatedPolls = polls.filter(p => p.id !== pollId);
    setPolls(updatedPolls);
    localStorage.setItem('vote4urRights_polls', JSON.stringify(updatedPolls));
    toast.success('Poll deleted successfully');
  };

  const getVoteCount = (poll: Poll, candidateId: string) => {
    return Object.values(poll.votes).filter(vote => vote === candidateId).length;
  };

  const getTotalVotes = (poll: Poll) => {
    return Object.keys(poll.votes).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="bg-white rounded-lg shadow-sm p-6 mb-8 animate-slide-in-left">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}</p>
          </div>
          <Button onClick={logout} variant="outline" className="hover-lift">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-8 animate-slide-in-right">
        <nav className="flex space-x-8 p-6">
          {[
            { id: 'overview', label: 'Dashboard', icon: BarChart3 },
            { id: 'create', label: 'Create Poll', icon: Plus },
            { id: 'polls', label: 'View Polls', icon: Calendar },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover-lift ${
                activeTab === id 
                  ? 'bg-blue-100 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Total Polls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 animate-counter">
                  {polls.length}
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-600" />
                  Active Elections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 animate-counter">
                  {polls.filter(p => p.status === 'ongoing').length}
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                  Total Votes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 animate-counter">
                  {polls.reduce((sum, poll) => sum + getTotalVotes(poll), 0)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'create' && (
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Create New Poll</CardTitle>
              <CardDescription>
                Create a new election poll with candidates and voting options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Election Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Presidential Election 2024"
                    value={newPoll.title}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the election"
                    value={newPoll.description}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={newPoll.startDate}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={newPoll.endDate}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Candidates</Label>
                  <Button onClick={addCandidate} variant="outline" size="sm" className="hover-lift">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Candidate
                  </Button>
                </div>

                {newPoll.candidates.map((candidate, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Name *</Label>
                        <Input
                          placeholder="Candidate name"
                          value={candidate.name}
                          onChange={(e) => updateCandidate(index, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bio *</Label>
                        <Textarea
                          placeholder="Candidate biography"
                          value={candidate.bio}
                          onChange={(e) => updateCandidate(index, 'bio', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Photo URL</Label>
                        <Input
                          placeholder="https://example.com/photo.jpg"
                          value={candidate.photo}
                          onChange={(e) => updateCandidate(index, 'photo', e.target.value)}
                        />
                        {newPoll.candidates.length > 1 && (
                          <Button 
                            onClick={() => removeCandidate(index)}
                            variant="destructive" 
                            size="sm"
                            className="w-full"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button onClick={createPoll} className="w-full civic-gradient hover-lift">
                Create Poll
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'polls' && (
          <div className="space-y-6">
            {polls.length === 0 ? (
              <Card className="text-center p-12">
                <CardContent>
                  <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Polls Created</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first election poll.</p>
                  <Button onClick={() => setActiveTab('create')} className="civic-gradient hover-lift">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Poll
                  </Button>
                </CardContent>
              </Card>
            ) : (
              polls.map((poll) => (
                <Card key={poll.id} className="card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {poll.title}
                          <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                            poll.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                            poll.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
                          </span>
                        </CardTitle>
                        <CardDescription>{poll.description}</CardDescription>
                      </div>
                      <Button 
                        onClick={() => deletePoll(poll.id)}
                        variant="destructive" 
                        size="sm"
                        className="hover-lift"
                      >
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Start:</strong> {new Date(poll.startDate).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 mb-4">
                          <strong>End:</strong> {new Date(poll.endDate).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Total Votes:</strong> {getTotalVotes(poll)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Results:</h4>
                        <div className="space-y-2">
                          {poll.candidates.map(candidate => {
                            const votes = getVoteCount(poll, candidate.id);
                            const percentage = getTotalVotes(poll) > 0 
                              ? ((votes / getTotalVotes(poll)) * 100).toFixed(1)
                              : '0';
                            
                            return (
                              <div key={candidate.id} className="flex justify-between items-center">
                                <span className="text-sm">{candidate.name}</span>
                                <span className="text-sm font-medium">{votes} ({percentage}%)</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
