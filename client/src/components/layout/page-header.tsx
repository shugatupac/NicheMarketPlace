interface PageHeaderProps {
  title: string;
  description?: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex flex-col space-y-2 pb-5 pt-2 md:pb-8 md:pt-4">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  );
}