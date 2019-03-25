package com.example.yu810.new_project;

import android.content.AsyncQueryHandler;
import android.content.Context;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.v4.app.Fragment;
import android.support.v7.widget.AppCompatSpinner;
import android.support.v7.widget.GridLayoutManager;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.example.yu810.new_project.dummy.DummyContent;
import com.example.yu810.new_project.dummy.DummyContent.DummyItem;
import com.example.yu810.new_project.dummy.ReportData;

import java.util.List;

import cz.msebera.android.httpclient.protocol.HttpRequestHandlerMapper;

/**
 * A fragment representing a list of Items.
 * <p/>
 * Activities containing this fragment MUST implement the {@link OnListFragmentInteractionListener}
 * interface.
 */
public class Account_deposit_Fragment extends Fragment {

    // TODO: Customize parameter argument names
    private static final String ARG_COLUMN_COUNT = "column-count";
    // TODO: Customize parameters
    private int mColumnCount = 1;
    private OnListFragmentInteractionListener mListener;
    private    RecyclerView recyclerView;
    private ReportData objReportData = new ReportData();
    public Handler getReportHandler = new Handler(){
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);

            recyclerView.setAdapter(new Account_deposit_RecyclerViewAdapter(DummyContent.ITEMS, mListener));
        }
    };

    /**
     * Mandatory empty constructor for the fragment manager to instantiate the
     * fragment (e.g. upon screen orientation changes).
     */
    public Account_deposit_Fragment() {
    }

    // TODO: Customize parameter initialization
    @SuppressWarnings("unused")
    public static Account_deposit_Fragment newInstance(int columnCount) {
        Account_deposit_Fragment fragment = new Account_deposit_Fragment();
        Bundle args = new Bundle();
        args.putInt(ARG_COLUMN_COUNT, columnCount);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        if (getArguments() != null) {
            mColumnCount = getArguments().getInt(ARG_COLUMN_COUNT);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_account_deposit_list, container, false);

        // Set the adapter
        if (view instanceof RecyclerView) {
            Context context = view.getContext();
            recyclerView = (RecyclerView) view;
            if (mColumnCount <= 1) {
                recyclerView.setLayoutManager(new LinearLayoutManager(context));
            } else {
                recyclerView.setLayoutManager(new GridLayoutManager(context, mColumnCount));
            }
            TextView date_in=(TextView)this.getActivity().findViewById(R.id.date_in);   //起始日期
            TextView date_in2=(TextView)this.getActivity().findViewById(R.id.date_in2); //结束日期
            AppCompatSpinner depositmodeSpinner=(AppCompatSpinner)this.getActivity().findViewById(R.id.depositmodeSpinner);//方式
            AppCompatSpinner depositTypeSpinner=(AppCompatSpinner)this.getActivity().findViewById(R.id.depositTypeSpinner);//类型
            AppCompatSpinner depositStateSpinner=(AppCompatSpinner)this.getActivity().findViewById(R.id.depositStateSpinner);//类型

            objReportData.setStartDate(date_in.getText().toString());
            objReportData.setEndDate(date_in2.getText().toString());
            //方式
            int spinner_pos = depositmodeSpinner.getSelectedItemPosition();
            String[] size_values = getResources().getStringArray(R.array.depositmodevalue);
            String strdepositmodevalue= size_values[spinner_pos];
            objReportData.setOperationMethod(strdepositmodevalue);
            //类型
            spinner_pos = depositTypeSpinner.getSelectedItemPosition();
            size_values = getResources().getStringArray(R.array.depositTypeValue);
            String strdepositTypeValue= size_values[spinner_pos];
            objReportData.setOperationType(strdepositTypeValue);
            //状态
            spinner_pos = depositStateSpinner.getSelectedItemPosition();
            size_values = getResources().getStringArray(R.array.depositStateValue);
            String strdepositStateValue= size_values[spinner_pos];
            objReportData.setOperationState(strdepositStateValue);

            objReportData.GetReportData(String.valueOf(ReportData.deposit_drawings_money) , getReportHandler);//从api拉数据回来

        }
        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
//        if (context instanceof OnListFragmentInteractionListener) {
//            mListener = (OnListFragmentInteractionListener) context;
//        } else {
//            throw new RuntimeException(context.toString()
//                    + " must implement OnListFragmentInteractionListener");
//        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p/>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnListFragmentInteractionListener {
        // TODO: Update argument type and name
        void onListFragmentInteraction(DummyItem item);
    }
}
