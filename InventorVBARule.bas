' Sample VBA rule for Autodesk Inventor
Sub SetLengthParameter()
    Dim oDoc As PartDocument
    Set oDoc = ThisApplication.ActiveDocument
    Dim oParam As Parameter
    Set oParam = oDoc.ComponentDefinition.Parameters.Item("Length")
    oParam.Expression = "150 mm"
    oDoc.Update2 True
End Sub
