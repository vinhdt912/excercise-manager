import { Tree } from "antd";
import type { DataNode } from "antd/es/tree";

interface Props {
  treeData: DataNode[];
  onSelect: (keys: string[]) => void;
}

const TreeSidebar: React.FC<Props> = ({ treeData, onSelect }) => {
  return (
    <Tree
      treeData={treeData}
      onSelect={(keys) => onSelect(keys as string[])}
      defaultExpandAll
    />
  );
};

export default TreeSidebar;
