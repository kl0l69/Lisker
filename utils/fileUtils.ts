import { Link, Folder } from './types';

interface ExportData {
  links: Link[];
  folders: Folder[];
  version: number;
}

export const exportDataToJson = (links: Link[], folders: Folder[]): void => {
  const data: ExportData = {
    links,
    folders,
    version: 1,
  };
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const link = document.createElement("a");
  link.href = jsonString;
  link.download = `linknest-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const importDataFromJson = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const data = JSON.parse(event.target.result as string) as ExportData;
          if (data.links && data.folders && data.version) {
            resolve(data);
          } else {
            reject(new Error('Invalid JSON format for LinkNest backup.'));
          }
        } else {
          reject(new Error('Could not read file.'));
        }
      } catch (error) {
        reject(new Error('Error parsing JSON file.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};
