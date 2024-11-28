import React, { useEffect, useRef } from 'react';
import BpmnJS from 'bpmn-js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBpmnAsync } from '../../../features/bpmn/bpmnSlice';
import { RootState } from '../../../app/store';

const BpmnDiagram: React.FC = () => {
  const dispatch = useDispatch();
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const viewer = useRef<BpmnJS | null>(null);

  const { data, loading, error } = useSelector((state: RootState) => state.bpmn);
  useEffect(() => {
    dispatch(fetchBpmnAsync());
  }, [dispatch]);

  useEffect(() => {
    if (data?.data && diagramRef.current) {
      if (!viewer.current) {
        viewer.current = new BpmnJS({ container: diagramRef.current });
      }
      if (typeof data.data === 'string') {
        viewer.current
          .importXML(data?.data)
          .then(() => viewer.current!.get('canvas').zoom('fit-viewport'))
          .catch((err) => console.error('Error loading diagram:', err));
      } else {
        console.error('Invalid data format, expected XML string');
      }
    }
  }, [data]);
  

  return (
    <div style={{ padding: '20px' }}>
      {loading && <p>Loading...</p>}
      {/* {error && <p style={{ color: 'red' }}>Error: {error}</p>} */}
      <div
        ref={diagramRef}
        style={{
          width: '100%',
          height: '500px',
          border: '1px solid #ccc',
        }}
      ></div>
    </div>
  );
};

export default BpmnDiagram;
