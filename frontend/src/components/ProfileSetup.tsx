import { useState } from 'react';

interface ProfileData {
  displayName: string;
  bio: string;
  skills: string[];
  interests: string[];
  experience: string;
}

interface ProfileSetupProps {
  onSubmit: (profile: ProfileData) => void;
  initialData?: Partial<ProfileData>;
}

export default function ProfileSetup({ onSubmit, initialData }: ProfileSetupProps) {
  const [profile, setProfile] = useState<ProfileData>({
    displayName: initialData?.displayName || '',
    bio: initialData?.bio || '',
    skills: initialData?.skills || [],
    interests: initialData?.interests || [],
    experience: initialData?.experience || 'beginner'
  });

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const addInterest = () => {
    if (interestInput.trim() && !profile.interests.includes(interestInput.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Display Name</label>
        <input
          type="text"
          value={profile.displayName}
          onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Skills</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className="flex-1 px-3 py-2 border rounded-lg"
            placeholder="Add a skill"
          />
          <button type="button" onClick={addSkill} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map(skill => (
            <span key={skill} className="px-2 py-1 bg-blue-100 rounded-full text-sm">
              {skill}
              <button type="button" onClick={() => removeSkill(skill)} className="ml-1 text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Interests</label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
            className="flex-1 px-3 py-2 border rounded-lg"
            placeholder="Add an interest"
          />
          <button type="button" onClick={addInterest} className="px-4 py-2 bg-green-600 text-white rounded-lg">
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.interests.map(interest => (
            <span key={interest} className="px-2 py-1 bg-green-100 rounded-full text-sm">
              {interest}
              <button type="button" onClick={() => removeInterest(interest)} className="ml-1 text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Experience Level</label>
        <select
          value={profile.experience}
          onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Save Profile
      </button>
    </form>
  );
}