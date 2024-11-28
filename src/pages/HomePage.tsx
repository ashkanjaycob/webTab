import BpmnDiagram from "../components/layout/bpmn/BpmnDiagram";
import BpmnViewer from "../components/layout/formio/formio";

function HomePage() {
  return (
    <div className="container">
      <h1 className="p-4">Welcome to HomePage</h1>
      <div className="bpmn-diagram">
        <BpmnDiagram />
      </div>
      <div className="form-viewer">
        <BpmnViewer />
      </div>
    </div>
  );
}

export default HomePage;
