
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { LogOut, Vote, Calendar, BarChart3, User, Clock, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  votes: Record<string, string>;
  status: 'upcoming' | 'ongoing' | 'ended';
}

const VoterDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('ongoing');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [showVoteModal, setShowVoteModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);

  useEffect(() => {
    loadPolls();
  }, []);

  const loadPolls = () => {
    const savedPolls = localStorage.getItem('vote4urRights_polls');
    if (savedPolls) {
      const parsedPolls = JSON.parse(savedPolls);
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
    }
  };

  const hasVoted = (poll: Poll) => {
    return user?.id && poll.votes[user.id];
  };

  const castVote = () => {
    if (!selectedPoll || !selectedCandidate || !user) return;

    const updatedPolls = polls.map(poll => {
      if (poll.id === selectedPoll.id) {
        return {
          ...poll,
          votes: {
            ...poll.votes,
            [user.id]: selectedCandidate
          }
        };
      }
      return poll;
    });

    setPolls(updatedPolls);
    localStorage.setItem('vote4urRights_polls', JSON.stringify(updatedPolls));
    
    setShowVoteModal(false);
    setSelectedCandidate('');
    toast.success('Vote cast successfully!');
    
    // Show results after voting
    setTimeout(() => {
      setShowResultsModal(true);
    }, 1000);
  };

  const getVoteCount = (poll: Poll, candidateId: string) => {
    return Object.values(poll.votes).filter(vote => vote === candidateId).length;
  };

  const getTotalVotes = (poll: Poll) => {
    return Object.keys(poll.votes).length;
  };

  const getChartData = (poll: Poll) => {
    return poll.candidates.map(candidate => ({
      name: candidate.name,
      votes: getVoteCount(poll, candidate.id),
      percentage: getTotalVotes(poll) > 0 
        ? ((getVoteCount(poll, candidate.id) / getTotalVotes(poll)) * 100).toFixed(1)
        : '0'
    }));
  };

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

  const filteredPolls = polls.filter(poll => {
    if (activeTab === 'ongoing') return poll.status === 'ongoing';
    if (activeTab === 'upcoming') return poll.status === 'upcoming';
    if (activeTab === 'past') return poll.status === 'ended';
    return false;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="bg-white rounded-lg shadow-sm p-6 mb-8 animate-slide-in-left">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Voter Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
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
            { id: 'ongoing', label: 'Ongoing Elections', icon: Vote, count: polls.filter(p => p.status === 'ongoing').length },
            { id: 'upcoming', label: 'Upcoming Elections', icon: Calendar, count: polls.filter(p => p.status === 'upcoming').length },
            { id: 'past', label: 'Past Elections', icon: BarChart3, count: polls.filter(p => p.status === 'ended').length },
          ].map(({ id, label, icon: Icon, count }) => (
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
              {count > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {filteredPolls.length === 0 ? (
          <Card className="text-center p-12">
            <CardContent>
              <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No {activeTab} Elections
              </h3>
              <p className="text-gray-600">
                {activeTab === 'ongoing' && 'There are no ongoing elections at the moment.'}
                {activeTab === 'upcoming' && 'No upcoming elections scheduled.'}
                {activeTab === 'past' && 'No past elections to display.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredPolls.map((poll) => (
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
                        {hasVoted(poll) && (
                          <CheckCircle2 className="w-5 h-5 ml-2 text-green-600" />
                        )}
                      </CardTitle>
                      <CardDescription>{poll.description}</CardDescription>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <p><Clock className="w-4 h-4 inline mr-1" />Ends: {new Date(poll.endDate).toLocaleString()}</p>
                      <p className="mt-1">Total Votes: {getTotalVotes(poll)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        {poll.candidates.length} candidates • Started {new Date(poll.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-x-2">
                      {poll.status === 'ongoing' && !hasVoted(poll) && (
                        <Button 
                          onClick={() => {
                            setSelectedPoll(poll);
                            setShowVoteModal(true);
                          }}
                          className="civic-gradient hover-lift"
                        >
                          <Vote className="w-4 h-4 mr-2" />
                          Vote Now
                        </Button>
                      )}
                      {(hasVoted(poll) || poll.status === 'ended') && (
                        <Button 
                          onClick={() => {
                            setSelectedPoll(poll);
                            setShowResultsModal(true);
                          }}
                          variant="outline"
                          className="hover-lift"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Results
                        </Button>
                      )}
                      {hasVoted(poll) && (
                        <span className="text-sm text-green-600 font-medium">✓ Voted</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Vote Modal */}
      <Dialog open={showVoteModal} onOpenChange={setShowVoteModal}>
        <DialogContent className="max-w-2xl animate-scale-in">
          <DialogHeader>
            <DialogTitle>Cast Your Vote</DialogTitle>
            <DialogDescription>
              {selectedPoll?.title} - Select your preferred candidate
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedPoll?.candidates.map((candidate) => (
              <Card 
                key={candidate.id}
                className={`cursor-pointer transition-all card-hover ${
                  selectedCandidate === candidate.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : ''
                }`}
                onClick={() => setSelectedCandidate(candidate.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      {candidate.photo ? (
                        <img 
                          src={candidate.photo} 
                          alt={candidate.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{candidate.name}</h4>
                      <p className="text-gray-600 text-sm mt-1">{candidate.bio}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedCandidate === candidate.id 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedCandidate === candidate.id && (
                        <CheckCircle2 className="w-4 h-4 text-white m-0.5" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVoteModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={castVote}
              disabled={!selectedCandidate}
              className="civic-gradient hover-lift"
            >
              Confirm Vote
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="max-w-4xl animate-chart-reveal">
          <DialogHeader>
            <DialogTitle>Election Results</DialogTitle>
            <DialogDescription>
              {selectedPoll?.title} - Live Results
            </DialogDescription>
          </DialogHeader>
          
          {selectedPoll && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">Vote Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getChartData(selectedPoll)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                      <Bar dataKey="votes" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Vote Percentage</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getChartData(selectedPoll)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="votes"
                      >
                        {getChartData(selectedPoll).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Detailed Results</h4>
                <div className="space-y-3">
                  {selectedPoll.candidates
                    .sort((a, b) => getVoteCount(selectedPoll, b.id) - getVoteCount(selectedPoll, a.id))
                    .map((candidate, index) => {
                      const votes = getVoteCount(selectedPoll, candidate.id);
                      const percentage = getTotalVotes(selectedPoll) > 0 
                        ? ((votes / getTotalVotes(selectedPoll)) * 100).toFixed(1)
                        : '0';
                      
                      return (
                        <div key={candidate.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-lg text-gray-500">#{index + 1}</span>
                            <div>
                              <h5 className="font-medium">{candidate.name}</h5>
                              <p className="text-sm text-gray-600">{candidate.bio}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600 animate-counter">{votes}</div>
                            <div className="text-sm text-gray-500">{percentage}%</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-center text-blue-800">
                    <strong>Total Votes Cast:</strong> {getTotalVotes(selectedPoll)}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowResultsModal(false)} className="hover-lift">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoterDashboard;
