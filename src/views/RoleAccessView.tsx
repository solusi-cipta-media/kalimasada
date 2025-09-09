"use client";

import type { ChangeEvent, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

import { useQuery } from "@tanstack/react-query";

import type { FeatureAccess } from "@/types/featureAccess";
import { requestGetFeatures } from "@/client/accessRequest";

function FormCheckBox({
  item,
  byPass,
  onChangeItem,
  chosenIds
}: {
  item: FeatureAccess;
  byPass: boolean;
  onChangeItem: (access: { id: number; set: "remove" | "add" }) => void;
  chosenIds: number[];
}) {
  let icon: ReactNode = "";

  if (item.icon) {
    icon = <i className={item.icon}></i>;
  }

  const [checked, setChecked] = useState(byPass ? byPass : item.hasAccess);

  useEffect(() => {
    setChecked(byPass ? byPass : chosenIds.includes(item.id));
  }, [byPass, chosenIds, item.id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;

    setChecked(checked);

    if (checked) {
      onChangeItem({ id: item.id, set: "add" });
    } else {
      onChangeItem({ id: item.id, set: "remove" });
    }
  };

  return (
    <FormGroup>
      <FormControlLabel
        label={
          <>
            {icon} {item.label}
          </>
        }
        control={<Checkbox checked={checked} onChange={handleChange} disabled={byPass} />}
      />
      <small className='text-secondary'>{item.description}</small>
    </FormGroup>
  );
}

export interface RoleAccessViewProps {
  byPass: boolean;
  chosenAccess: number[];
  onChangeItem: (access: { id: number; set: "remove" | "add" }) => void;
}

export default function RoleAccessView(props: RoleAccessViewProps) {
  const { isLoading, data } = useQuery({
    queryKey: ["RoleAccessView"],
    queryFn: async () => {
      const access = await requestGetFeatures();

      return access.data;
    }
  });

  const jsx = useMemo(() => {
    if (!data) return <></>;

    function generateJsx(access: FeatureAccess[], i: number = 0) {
      return access.map((item) => {
        return (
          <div key={item.label + item.id} className='d-flex align-items-center mt-3' style={{ paddingLeft: `${i}rem` }}>
            <FormCheckBox
              item={item}
              byPass={props.byPass}
              onChangeItem={(item) => {
                props.onChangeItem(item);
              }}
              chosenIds={props.chosenAccess}
            />
            {item.children && generateJsx(item.children, i + 1)}
          </div>
        );
      });
    }

    return generateJsx(data);
  }, [data, props]);

  if (isLoading) return <div>Loading...</div>;

  return <>{jsx}</>;
}
