import { Card, CardContent } from '@/components/ui/card';


const CodeCard = ({ 
    icon: Icon, 
    title, 
    description 
  }: { 
    icon: React.ComponentType<{ className?: string }>, 
    title: string, 
    description: string 
  }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 h-full">
      <CardContent className="p-6 flex flex-col items-start gap-4 h-full">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 group-hover:from-purple-500/20 group-hover:to-blue-500/20 transition-all duration-300">
          <Icon className="text-2xl text-purple-600" />
        </div>
        <div>
          <h3 className="font-bold mb-2">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
        </div>
      </CardContent>
    </Card>
  );

export default CodeCard;