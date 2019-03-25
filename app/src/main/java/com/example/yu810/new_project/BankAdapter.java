package com.example.yu810.new_project;

import android.content.Context;
import android.support.annotation.NonNull;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import java.util.ArrayList;

public class BankAdapter extends ArrayAdapter<Bank_item>{
    public BankAdapter(Context context, ArrayList<Bank_item> bankList){
        super(context,0,bankList);
    }

    @NonNull
    @Override
    public View getView(int position,@NonNull View convertView, @NonNull ViewGroup parent) {
        return initView(position,convertView,parent);
    }

    @Override
    public View getDropDownView(int position, @NonNull View convertView, @NonNull ViewGroup parent) {
        return initView(position,convertView,parent);
    }
    private View initView(int position,View convertView,ViewGroup parent){
        if(convertView == null){
            convertView = LayoutInflater.from(getContext()).inflate(
                    R.layout.activity_spinner_bank,parent,false
            );
        }
        TextView textViewName = convertView.findViewById(R.id.bank_item);
        Bank_item bank_item = getItem(position);
        if(bank_item != null) {
            textViewName.setText(bank_item.getbankname());
        }
        return convertView;
    }
}