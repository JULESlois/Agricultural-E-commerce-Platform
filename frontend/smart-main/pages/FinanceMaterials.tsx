import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, SectionTitle } from '../components/Common';
import { FileUp, CheckCircle2, ArrowLeft } from 'lucide-react';

export const FinanceMaterials: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<{ type: string; name: string }[]>([]);

  const handleUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFiles(prev => [...prev, { type, name: f.name }]);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Button variant="text" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} className="mr-1" /> 返回评估结果
      </Button>

      <Card className="p-8">
        <SectionTitle title="材料补充" subtitle="上传资产证明、学历证明等，以提升您的信用评估" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-green-50 text-[#4CAF50] rounded">
                <FileUp size={18} />
              </div>
              <div className="font-bold">资产证明</div>
            </div>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => handleUpload('资产证明', e)} />
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-50 text-[#1976D2] rounded">
                <FileUp size={18} />
              </div>
              <div className="font-bold">学历证明</div>
            </div>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => handleUpload('学历证明', e)} />
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-orange-50 text-[#FF9800] rounded">
                <FileUp size={18} />
              </div>
              <div className="font-bold">经营证明</div>
            </div>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => handleUpload('经营证明', e)} />
          </div>
        </div>

        <div className="mt-6">
          <div className="font-bold mb-2">已上传</div>
          <div className="space-y-2">
            {files.length === 0 && <div className="text-sm text-gray-500">暂无上传记录</div>}
            {files.map((f, i) => (
              <div key={`${f.type}-${i}`} className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-[#4CAF50]" />
                <span className="text-gray-700">{f.type}</span>
                <span className="text-gray-400">- {f.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t mt-6 flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/finance/evaluate')}>返回评估页</Button>
          <Button variant="solid-blue" onClick={() => navigate('/finance/apply/1')}>继续申请贷款</Button>
        </div>
      </Card>
    </div>
  );
};

export default FinanceMaterials;
