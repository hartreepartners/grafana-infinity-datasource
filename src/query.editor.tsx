import React, { useState } from 'react';
import { defaultsDeep } from 'lodash';
import { QueryEditorProps } from '@grafana/data';
import { Datasource } from './datasource';
import { TypeChooser } from './editors/TypeChooser';
import { AdvancedOptions } from './editors/AdvancedOptions';
import { Scrapper as ScrapperOptions } from './editors/Scrapper';
import { SeriesEditor } from './editors/Series';
import { InfinityQuery, RestVariableQuery } from './types';

interface InfinityEditorProps {
  instanceSettings: any;
  mode: 'standard' | 'global';
  onChange: any;
  query: InfinityQuery;
}

export const InfinityQueryEditor: React.FC<InfinityEditorProps> = ({ query, onChange, mode, instanceSettings }) => {
  query = defaultsDeep(query, {
    type: 'csv',
    source: 'inline',
    format: 'table',
    url: '',
    url_options: {
      method: 'GET',
      data: '',
    },
    data: '',
    root_selector: '',
    columns: [],
  });

  return (
    <div>
      <TypeChooser onChange={onChange} query={query} mode={mode} instanceSettings={instanceSettings} />
      {query.type === 'series' ? <SeriesEditor onChange={onChange} query={query} /> : <></>}
      {['csv', 'html', 'json', 'graphql', 'xml'].indexOf(query.type) > -1 ? (
        <ScrapperOptions onChange={onChange} query={query} />
      ) : (
        <></>
      )}
      {query.type !== 'global' ? <AdvancedOptions onChange={onChange} query={query} /> : <></>}
    </div>
  );
};

type EditorProps = QueryEditorProps<Datasource, InfinityQuery>;

export const QueryEditor: React.FC<EditorProps> = props => {
  let { query, onChange } = props;
  let default_global_query_id = '';
  if (
    props.datasource.instanceSettings.jsonData.global_queries &&
    props.datasource.instanceSettings.jsonData.global_queries.length > 0
  ) {
    default_global_query_id = props.datasource.instanceSettings.jsonData.global_queries[0].id;
  }
  query = defaultsDeep(query, {
    query_mode: 'standard',
    global_query_id: default_global_query_id,
  });
  return (
    <div>
      <InfinityQueryEditor
        onChange={onChange}
        query={query}
        mode="standard"
        instanceSettings={props.datasource.instanceSettings}
      />
    </div>
  );
};

interface RestVariableQueryProps {
  query: RestVariableQuery;
  onChange: (query: RestVariableQuery, definition: string) => void;
}

export const VariableQueryEditor: React.FC<RestVariableQueryProps> = ({ onChange, query }) => {
  const [state, setState] = useState(query);

  const saveQuery = () => {
    onChange(state, `${state.uri} (${state.columnSelector})`);
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>) =>
    setState({
      ...state,
      [event.currentTarget.name]: event.currentTarget.value,
    });

  return (
    <div>
      <div className="gf-form">
        <span className="gf-form-label width-10">uri</span>
        <input name="uri" className="gf-form-input" onBlur={saveQuery} onChange={handleChange} value={state.uri} />
      </div>
      <div className="gf-form">
        <span className="gf-form-label width-10">columnSelector</span>
        <input
          name="columnSelector"
          className="gf-form-input"
          onBlur={saveQuery}
          onChange={handleChange}
          value={state.columnSelector}
        />
      </div>
    </div>
  );
};
