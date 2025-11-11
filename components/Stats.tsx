import React from 'react';
import { Link } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsProps {
  links: Link[];
}

const AnimatedNumber: React.FC<{ value: number }> = ({ value }) => {
    const [count, setCount] = React.useState(0);
    const ref = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const node = ref.current;
        if (!node) return;
        
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                let start = 0;
                const end = value;
                const duration = 1500;
                let startTime: number | null = null;

                const step = (timestamp: number) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    setCount(Math.floor(progress * (end - start) + start));
                    if (progress < 1) {
                        window.requestAnimationFrame(step);
                    }
                };
                window.requestAnimationFrame(step);
                observer.disconnect();
            }
        }, { threshold: 0.7 });

        observer.observe(node);

        return () => observer.disconnect();
    }, [value]);

    return <span ref={ref}>{count}</span>;
};

const Stats: React.FC<StatsProps> = ({ links }) => {
  const totalLinks = links.length;

  const tagCounts = links.flatMap(link => link.tags).reduce((acc: Record<string, number>, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  const sortedTags = Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="surface-background rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 neon-heading">Statistics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col items-center justify-center bg-gray-50/80 dark:bg-gray-700/80 p-4 rounded-lg">
          <span className="text-4xl font-extrabold text-primary-600 dark:text-primary-400 neon-text">
            <AnimatedNumber value={totalLinks} />
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Total Links Saved</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-gray-50/80 dark:bg-gray-700/80 p-4 rounded-lg">
          <span className="text-4xl font-extrabold text-primary-600 dark:text-primary-400 neon-text">
            <AnimatedNumber value={Object.keys(tagCounts).length} />
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Unique Tags</span>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Top 5 Tags</h3>
        {sortedTags.length > 0 ? (
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={sortedTags} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                    <XAxis dataKey="name" stroke="currentColor" className="text-xs text-gray-600 dark:text-gray-400"/>
                    <YAxis allowDecimals={false} stroke="currentColor" className="text-xs text-gray-600 dark:text-gray-400"/>
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                            borderColor: 'rgba(75, 85, 99, 0.5)',
                            color: '#ffffff',
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Bar dataKey="count" fill="var(--color-primary-500)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">Add some tags to see your stats!</p>
        )}
      </div>
    </div>
  );
};

export default Stats;