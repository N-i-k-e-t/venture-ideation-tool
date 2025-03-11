import { LucideIcon, Lightbulb, BarChart3, LineChart, FileText } from "lucide-react";

interface StageCardProps {
  title: string;
  description: string;
  icon: "lightbulb" | "barChart" | "fileText" | "lineChart";
  items: string[];
}

export default function StageCard({ title, description, icon, items }: StageCardProps) {
  const renderIcon = () => {
    switch (icon) {
      case "lightbulb":
        return <Lightbulb className="h-6 w-6 text-primary-600" />;
      case "barChart":
        return <BarChart3 className="h-6 w-6 text-blue-600" />;
      case "fileText":
        return <FileText className="h-6 w-6 text-purple-600" />;
      case "lineChart":
        return <LineChart className="h-6 w-6 text-amber-600" />;
      default:
        return <Lightbulb className="h-6 w-6 text-primary-600" />;
    }
  };
  
  const getIconBgColor = () => {
    switch (icon) {
      case "lightbulb":
        return "bg-primary-100";
      case "barChart":
        return "bg-blue-100";
      case "fileText":
        return "bg-purple-100";
      case "lineChart":
        return "bg-amber-100";
      default:
        return "bg-primary-100";
    }
  };
  
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${getIconBgColor()} rounded-md p-3`}>
            {renderIcon()}
          </div>
          <div className="ml-5">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="mt-4">
          <ul className="space-y-2 text-sm text-gray-600">
            {items.map((item, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
