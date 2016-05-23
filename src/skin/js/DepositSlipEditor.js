console.log(paymentData);
$("#DepositDate").datepicker({format: 'yyyy-mm-dd'});

function format(d) {
  // `d` is the original data object for the row
  return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
          '<tr>' +
          '<td>Date:</td>' +
          '<td>' + d.plg_date + '</td>' +
          '</tr>' +
          '<tr>' +
          '<td>Fiscal Year:</td>' +
          '<td>' + d.FiscalYear + '</td>' +
          '</tr>' +
          '<tr>' +
          '<td>Fund(s):</td>' +
          '<td>' + d.fun_Name + '</td>' +
          '</tr>' +
          '<tr>' +
          '<td>Non Deductible:</td>' +
          '<td>' + d.plg_NonDeductible + '</td>' +
          '</tr>' +
          '<tr>' +
          '<td>Comment:</td>' +
          '<td>' + d.plg_comment + '</td>' +
          '</tr>' +
          '</table>';
}

$("#DepositSlipEditor").submit(function(e) {
  e.preventDefault();
  var formData = {
    'depositDate': $('#DepositDate').val(),
    'depositComment': $("#Comment").val(),
    'depositClosed': $('#Closed').is(':checked'),
    'depositType': depositType

  };
  console.log(formData);

  //process the form
  $.ajax({
    type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url: '/api/deposits/' + depositSlipID, // the url where we want to POST
    data: JSON.stringify(formData), // our data object
    dataType: 'json', // what type of data do we expect back from the server
    encode: true
  })
          .done(function(data) {
            console.log(data);
            location.reload();
          }).fail(function() {
  });
});

$('#paymentsTable tbody').on('click', 'td.details-control', function() {
  var tr = $(this).closest('tr');
  var row = dataT.row(tr);

  if(row.child.isShown()) {
    // This row is already open - close it
    row.child.hide();
    tr.removeClass('shown');
    tr.innerHTML('<i class="fa fa-plus-circle"></i>');
  }
  else {
    // Open this row
    row.child(format(row.data())).show();
    tr.addClass('shown');
    tr.innerHTML('<i class="fa fa-minus-circle"></i>');
  }
});

$("#paymentsTable tbody").on('click', 'tr', function() {
  console.log("clicked");
  $(this).toggleClass('selected');
  var selectedRows = dataT.rows('.selected').data().length;
  $("#deleteSelectedRows").prop('disabled', !(selectedRows));
  $("#deleteSelectedRows").text("Delete (" + selectedRows + ") Selected Rows");

});

$('#deleteSelectedRows').click(function() {
  var deletedRows = dataT.rows('.selected').data()
  console.log(deletedRows);
  console.log("delete-button" + deletedRows.length);
  $("#deleteNumber").text(deletedRows.length);
  $("#confirmDelete").modal('show');
});

$("#deleteConfirmed").click(function() {
  var deletedRows = dataT.rows('.selected').data()
  $.each(deletedRows, function(index, value) {
    console.log(value);
    $.ajax({
      type: 'DELETE', // define the type of HTTP verb we want to use (POST for our form)
      url: '/api/payments/' + value.plg_GroupKey, // the url where we want to POST
      dataType: 'json', // what type of data do we expect back from the server
      encode: true
    })
            .done(function(data) {
              console.log(data);
              $('#confirmDelete').modal('hide');
              dataT.rows('.selected').remove().draw(false);
            });
  });
});